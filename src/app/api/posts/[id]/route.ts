import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slug';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

interface PostId {
  id: string,
}

type RouteContext = {
  params: Promise<PostId>
}


// Вспомогательная функция для создания уникального slug при редактировании поста.
//
// Почему она нужна:
// если пользователь поменял title,
// мы хотим обновить slug.
//
// Но slug должен быть уникальным,
// потому что в Prisma schema у Post поле slug помечено как @unique.
async function createUniqueSlug(title: string, currentPostId: string) {
  // Сначала создаём базовый slug из title.
  // Например: "Hello World!" -> "hello-world".
  const baseSlug = slugify(title);

  // Если title состоит из символов, из которых slug не получается,
  // например только эмодзи или спецсимволы,
  // создаём fallback slug на основе timestamp.
  if (!baseSlug) {
    return `post-${Date.now()}`;
  }

  // Начало с обычного slug.
  let slug = baseSlug;

  // Count нужен, если такой slug уже занят.
  // Тогда будет:
  // my-post
  // my-post-2
  // my-post-3
  let count = 1;

  // Цикл будет работать, пока не найдёт свободный slug.
  while(true) {
    // Ищем пост с таким slug.
    // findUnique используется, потому что slug уникальный.
    // В schema.prisma у нас: slug String @unique
    const existPost = await prisma.post.findUnique({
      where: {
        slug,
      },
      // select говорит Prisma вернуть только id.
      // Нам не нужен весь пост, только понять:
      // существует ли запись и чья она.
      select: {
        id: true,
      }
    });

    // Если пост с таким slug не найден — slug свободен.
    // Или если найденный пост — это тот же самый пост,
    // то slug тоже можно оставить.
    if (!existPost || existPost.id === currentPostId) {
      return slug;
    }

    // Если slug занят другим постом, инкремент coun.
    count += 1;

    // Применение нового slug.
    slug = `${baseSlug}-${count}`;
  }
}


// PATCH отвечает за обновление поста.
// HTTP PATCH обычно используется для частичного или полного обновления ресурса.
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    // из cookie сессии достается пользователь
    const user = await getCurrentUser();

    // Если пользователь не авторизован возвращается 401
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      );
    }

    // из динамических параметров пути извлекается идентификатор поста
    // /api/posts/cm123 -> cm123
    const { id } = await params;

    // поиск в бд поста, который требуется отредактировать
    const existPost = await prisma.post.findUnique({
      where: {
        id,
      },
      // возвращение только тех данных, которые требуются для проверки
      // id - проверка сущетсвует ли пост
      // authorId - проверка принадлежности поста к текущему пользователю
      select: {
        id: true,
        authorId: true,
      }
    });

    // Если пост не был найден в бд, то 404
    if (!existPost) {
      return NextResponse.json(
        { message: 'Post not found.' },
        { status: 404 }
      );
    }

    // Если идентификаторы текущего пользователя и автора поста не совпдают,
    // то 403
    if (existPost.authorId !== user.id) {
      return NextResponse.json(
        { message: 'You can edit only own posts.'},
        { status: 403 },
      );
    }

    // Извлечение тела запроса из объекта запроса
    const body = await request.json();

    // Приведение полей к строкам и очиска от лишних пробелов
    const title = String(body.title || '').trim();
    const excerpt = String(body.excerpt || '').trim();
    const content = String(body.content || '').trim();
    const imageUrl = String(body.imageUrl || '').trim();

    // простая backend-валидация на длинну значения для поля
    if (title.length < 3) {
      return NextResponse.json(
        { message: 'Title length must be least 3 characters'},
        { status: 400 }
      );
    }

    if (excerpt.length < 10) {
      return NextResponse.json(
        { message: 'Excerpt length must be least 10 characters'},
        { status: 400 }
      );
    }

    if (content.length < 20) {
      return NextResponse.json(
        { message: 'Content length must be least 20 characters'},
        { status: 400 }
      );
    }

    // Создание уникального slug
    // Передается id поста, чтобы старый slug не конфликтовал с новым
    const slug = await createUniqueSlug(title, id);

    // Обновление поста в бд
    // Весь обновленный пост записывается в константу чтобы можно было вернуть
    // его в ответе
    const patchedPost = await prisma.post.update({
      // какая запись подлежит обновлению
      where: {
        id,
      },
      // новые данные для обновляемого поста
      data: {
        // измененные поля
        title,
        slug,
        excerpt,
        content,
        // если imageUrl не передан, то записывается null
        imageUrl: imageUrl || null,

        // изменяемый пост сразу попадает на модерацию
        status: 'PENDING',

        // поле очищается в любом случае, даже если оно ранее существовало
        rejectReason: null,
      },
      // на фронтенд возвращается только то, что необходимо для интефейса
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
      }
    });

    // После всех процедур проверок, можно отдать успешный запрос с обновленным
    // постом
    return NextResponse.json(
      {
        message: 'Post successfully updated and submitted to moderation.',
        patchedPost,
      },
      { status: 200 }
    );
  } catch (error) {
    // Блок обработки ошибки
    console.error(error);

    return NextResponse.json(
      { message: 'Something wrong.' },
      { status: 500 }
    );
  }
}


// DELETE отвечает за удаление поста.
export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    // из cookie сессии достается пользователь
    const user = await getCurrentUser();

    // Если пользователь не авторизован возвращается 401
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required.'},
        { status: 401 },
      );
    }

    // из динамических параметров роута получаем идентификатор поста
    const { id } = await params;

    // Вычисление поста, который необходимо удалить
    const existPost = await prisma.post.findUnique({
      // по какому парамету происходит поиск
      where: {
        id
      },
      // Извлечение только тех полей, которые необходимы далее для проверок
      // и действий
      select: {
        id: true,
        authorId: true,
      }
    });

    // Если пост не был найден, то 404
    if (!existPost) {
      return NextResponse.json(
        { message: 'Post not found.'},
        { status: 404 }
      );
    }

    // Если пост был найден, но идентификатор автора поста не совпадает
    // с идентификатором текущего пользователя, то 403, только
    // владелец поста может его удалить
    if (existPost.authorId !== user.id) {
      return NextResponse.json(
        { message: 'You can remove only own posts.'},
        { status: 403 },
      );
    }

    // После всех проверок процедура удаления поста из бд
    // в данном случае вообще ничего не требуется, поэтому только where блок
    await prisma.post.delete({
      where: {
        id
      },
    });

    // В завершении процедуры удаления успешный ответ с сообщением
    return NextResponse.json(
      { message: 'Post successfuly deleted' },
      { status: 200 }
    );

  } catch (error) {
    // Блок обработки ошибки
    console.error(error);

    return NextResponse.json(
      { message: 'Something wrong.' },
      { status: 500 }
    );
  }
}

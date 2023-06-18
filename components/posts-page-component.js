import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, user } from "../index.js";
import { addLike, removeLike, getPosts } from "../api.js";

import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

// const newDate = new Date;
// const year = newDate.getFullYear().toString().slice(2);
// const month = ("0" + (newDate.getMonth() + 1)).slice(-2);
// const day = ("0" + newDate.getDate()).slice(-2);
// const hours = ("0" + newDate.getHours()).slice(-2);
// const minutes = ("0" + newDate.getMinutes()).slice(-2);
// let needTrueDate = `${hours}:${minutes} ${day}.${month}.${year}`

export function renderPostsPageComponent({ appEl }) {

  const appHtml = posts.map((post) => {
    const needTrueDate = formatDistanceToNow(new Date(post.createdAt), { locale: ru });
    return ` <div class="page-container">
    <div class="header-container"></div>
    <ul class="posts">
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <div class="post-likes">
        <button data-post-id="${post.id}" class="like-button">
        <img src="./assets/images/like-not-active.svg"> 
          <p class="post-likes-text">
          Нравится: <strong>${post.likes.length}</strong>
        </p>
        </button>
      </div>
        <p class="post-date">
      ${needTrueDate}
        </p>
      </li>
        </ul>
          </div>`;
  }).join('');

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  const token = getToken();

  const buttons = document.querySelectorAll('.like-button');
  buttons.forEach(button => button.addEventListener('click', function () {
    const postId = this.dataset.postId; // Получаем идентификатор поста
    const foundPost = posts.find(function (post) { return post.id === postId }); // Ищем пост по идентификатору

    if (!foundPost) { // Если пост не найден
      return; // Возвращаемся
    }

    const liked = foundPost.likes.find(function (like) {
      if (user === null) {
        alert('Для внесения изменений - авторизуйтесь');
      } else {
        return like.name === user.name
      }

    }); // Ищем лайк с именем пользователя

    // Если лайк найден
    if (liked) {
      removeLike({ token: token, id: postId });

    } else { // Иначе добавляем лайк
      addLike({ token: token, id: postId });
    }

    const strongEl = this.querySelector('strong'); // Находим элемент strong внутри кнопки
    if (liked) {
      // Если лайк уже был поставлен, уменьшаем количество лайков на 1
      foundPost.likes = foundPost.likes.filter(like => like.name !== user.name);
      strongEl.textContent = foundPost.likes.length; // Обновляем значение количества лайков
      // Уменьшаем размер шрифта элемента strong
      strongEl.style.fontSize = parseInt(strongEl.style.fontSize) - 2 + 'px';
    } else {
      // Если лайк ещё не был поставлен, добавляем его в список лайков
      foundPost.likes.push({ name: user.name });
      strongEl.textContent = foundPost.likes.length; // Обновляем значение количества лайков
      // Увеличиваем размер шрифта элемента strong
      strongEl.style.fontSize = parseInt(strongEl.style.fontSize) + 2 + 'px';
    }

  }));


}


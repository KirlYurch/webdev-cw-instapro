import { addPost, getPosts, getPostsUser } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderHeaderComponent } from "./components/header-component.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

export const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;

};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,           // Страница постов 
      AUTH_PAGE,            // Страница авторизации 
      ADD_POSTS_PAGE,       // Страница добавления поста
      USER_POSTS_PAGE,      // Страница отдельных постов юзера
      LOADING_PAGE,         // Страница загрузки
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;

          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

// Получение постов отдельного юзера
    if (newPage === USER_POSTS_PAGE) {
      getPostsUser({ token: getToken(), id: data.userId })
        .then((newPosts) => {
          page = USER_POSTS_PAGE;
          posts = newPosts;
          return renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }
    page = newPage;
    renderApp();
    return;
  }

  throw new Error("Cтраницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  // Страница загрузки
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

// Страница авторизации
  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  // Добавление поста
  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        const token = getToken();

        fetch("https://wedev-api.sky.pro/api/v1/prod/instapro", {
          method: "POST",
          body: JSON.stringify({
            description: description,
            imageUrl: imageUrl,
          }),
          headers: {
            Authorization: token,
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((responseData) => {
          });
        goToPage(POSTS_PAGE);
      },
    });
  }

// Страница постов 
  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  // Страницу фотографию пользвателя
  if (page === USER_POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });

  }
};

goToPage(POSTS_PAGE);

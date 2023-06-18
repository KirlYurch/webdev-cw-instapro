
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

// Реализация добавления поста
export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  const render = () => {
    const appHtml = `<div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
  <div class="upload"></div>
  <br>
      Добавьте описание:
          <textarea class="input textarea" rows="4" id="input textarea"></textarea>
          </label>
          <br><br>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>`;

    appEl.innerHTML = appHtml;
    const descriptText = document.getElementById('input textarea');

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    renderUploadImageComponent({
      element: document.querySelector(".upload"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        description: descriptText.value,
        imageUrl,
      });
    });
  };

  render();
}

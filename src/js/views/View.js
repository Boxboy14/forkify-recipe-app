import icons from 'url:../../img/icons.svg'; // parcel 2

export default class View {
  _data;
  /**
   * Renders the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered to the DOM
   * @param {boolean} [render = true] If false , create markup string instead of rendering to the DOM
   * @returns {undefined | string} A string is returned if render=false
   * @this {Object} View instance
   * @author Rutu Kadam
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); // generate new markup bcoz we need to compare this new markup with the old markup , although we would not render the entire new markup , it is just for comparison
    // Comparing the newly generated markup which is a just with the actual DOM elements is really difficult , to solve this problem , we have trick and that is , converting the newMarkup into the DOM object which lives in memory so that then we can compare it with the original DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    // console.log(currentElements);
    // console.log(newElements);

    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];
      //   console.log(curEl, newEl.isEqualNode(curEl));

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('👻', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner = function () {
    const markup = `
                      <div class="spinner">
                          <svg>
                              <use href="${icons}#icon-loader"></use>
                          </svg>
                      </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `<div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

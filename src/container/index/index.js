export class Todo {
  static #list = []

  static #count = 0

  static #createTaskData = (text) => {
    this.#list.push({
      id: ++this.#count,
      text,
      done: false,
    })
  }

  static #block = null
  static #template = null
  static #input = null
  static #button = null

  static #NAME = 'todo'

  static #saveLocalData = () => {
    localStorage.setItem(
      this.#NAME,
      JSON.stringify({
        list: this.#list,
        count: this.#count,
      }),
    )
  }

  static #loadLocalData = () => {
    const data = window.localStorage.getItem(this.#NAME)

    let rowData = null

    if (data) {
      try {
        rowData = JSON.parse(data)
      } catch (e) {
        return null
      }

      this.#list = rowData.list
      this.#count = rowData.count
    }
  }

  static init = () => {
    this.#template =
      document.getElementById(
        'item',
      ).content.firstElementChild

    this.#block = document.querySelector(
      '.main__items-list',
    )

    this.#input = document.querySelector(
      '.main__input-bar__input',
    )

    this.#button = document.querySelector(
      '.main__input-bar__button',
    )

    this.#loadLocalData()

    this.#button.onclick = this.#handleAdd

    this.#render()
  }

  static #handleAdd = () => {
    const inputValue = this.#input.value
    if (inputValue.length > 0) {
      this.#createTaskData(inputValue)
      this.#saveLocalData()

      this.#input.value = ''
      this.#render()
    }
  }

  static #render = () => {
    this.#block.innerHTML = ''

    if (this.#list.length === 0) {
      this.#block.innerText = 'Список задач пустий'
    } else {
      this.#list.forEach((taskData) => {
        const el = this.#createTaskElement(taskData)
        this.#block.append(el)
      })
    }
  }

  static #createTaskElement = (data) => {
    const el = this.#template.cloneNode(true)

    const [info, buttons] = el.children
    const [id, text] = info.children
    const [btnDo, btnCancel] = buttons.children

    if (data.done) {
      info.classList.add(
        'main__items-list__item__info--light',
      )
      btnDo.classList.remove(
        'main__items-list__item__button-set__button--check',
      )
      btnDo.classList.add(
        'main__items-list__item__button-set__button--checked',
      )
    }

    id.innerHTML = `${data.id}.`
    text.innerHTML = data.text

    btnCancel.onclick = this.#handleCancel(data)

    btnDo.onclick = this.#handleDo(data, btnDo, info)

    return el
  }

  static #handleCancel = (data) => () => {
    if (confirm('Видалити задачу?')) {
      const result = this.#deleteById(data.id)
      if (result) {
        this.#saveLocalData()
        this.#render()
      }
    }
  }

  static #deleteById = (id) => {
    try {
      this.#list = this.#list.filter(
        (item) => item.id !== id,
      )
      return true
    } catch (e) {
      return false
    }
  }

  static #handleDo = (data, btn, el) => () => {
    const result = this.#toggleDone(data.id)

    if (result === true || result === false) {
      el.classList.toggle(
        'main__items-list__item__info--light',
      )
      btn.classList.toggle(
        'main__items-list__item__button-set__button--check',
      )
      btn.classList.toggle(
        'main__items-list__item__button-set__button--checked',
      )
    }
  }

  static #toggleDone = (id) => {
    const item = this.#list.find((item) => item.id === id)

    if (item) {
      item.done = !item.done

      this.#saveLocalData()

      return item.done
    } else {
      return null
    }
  }
}

Todo.init()

window.todo = Todo

import Sort from "../components/Sort.js";
import FormErrors from "../components/FormErrors.js";
import React from "react";
import { CurrentElementContext } from "../contexts/CurrentElementContext.js";

function Table(props) {
  const deleteElement = props.isElementClicked ? "" : "table__button_invisible";

  function handleChange(e) {
    const { name, value } = e.target;
    props.setElement({
      ...props.element,
      [name]: value,
    }, props.validateField(name, value));
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.addElement(props.element);
  }

  const currentElement = React.useContext(CurrentElementContext);

  return (
    <>
      <Sort
        data={props.data}
        setData={props.setData}
        dataFilter={props.dataFilter}
        setDataFilter={props.setDataFilter}
        filter={props.filter}
        />
      <div className="table">
        <ul className="table__header">
          <li className="table__text">Дата</li>
          <li className="table__text" onClick={() => {props.sortName()}}>Название</li>
          <li className="table__text" onClick={() => {props.sortQuantity()}}>Количество</li>
          <li className="table__text" onClick={() => {props.sortDistance()}}>Расстояние</li>
        </ul>
        {props.elementsForPage.map((element) => {
          return (
            <ul className="table__header" onClick={() => {props.clickOnElement(element._id)}}>
              <li className="table__text">{(String(element.date).substr(0, 10)).split('-').reverse().join('.')}</li>
              <li className="table__text">{element.name}</li>
              <li className="table__text">{element.quantity}</li>
              <li className="table__text">{element.distance}</li>
            </ul>
          );
        })}
      </div>
      <div className="table__header">
      {props.pagesNumber.map((element) => {
          return (
            <p onClick={() => {props.showPage(element)}}>{element}</p>
          );
        })}
        </div>
      <h1 className="sort__header">Добавить элемент</h1>
      <div className="sort__container">
        <form
          onSubmit={handleSubmit}
          className="sort__form"
          name="sort__form"
          id="sort__form"
          noValidate
          method="POST"
        >
          <input
            onChange={handleChange}
            placeholder="Название"
            value={props.element.name}
            className="sort__input"
            required
            name="name"
          />
          <FormErrors formErrors={props.validity.formErrors.name}/>
          <input
            onChange={handleChange}
            placeholder="Дата"
            value={props.element.date}
            className="sort__input"
            required
            name="date"
          />
          <FormErrors formErrors={props.validity.formErrors.date}/>
          <input
            onChange={handleChange}
            placeholder="Количество"
            value={props.element.quantity}
            className="sort__input"
            required
            name="quantity"
          />
          <FormErrors formErrors={props.validity.formErrors.quantity}/>
          <input
            onChange={handleChange}
            placeholder="Расстояние"
            value={props.element.distance}
            className="sort__input"
            required
            name="distance"
          />
          <FormErrors formErrors={props.validity.formErrors.distance}/>
          <button type="submit" className="table__button">
            Добавить элемент
          </button>
        </form>
      </div>
      <button
        onClick={() => {props.deleteElement(currentElement.id)}}
        className={`table__button ${deleteElement}`}
      >
        Удалить элемент
      </button>
    </>
  );
}

export default Table;

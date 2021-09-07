import "../index.css";
import Error404 from "../components/Error404.js";
import Table from "../components/Table.js";
import React from "react";
import { Route, Switch } from "react-router-dom";
import api from "../utils/Api.js";
import { CurrentElementContext } from "../contexts/CurrentElementContext.js";

function App() {
  const [isElementClicked, setIsElementClicked] = React.useState(false);
  const [elements, setElements] = React.useState([]);
  const [changes, setChanges] = React.useState(0);
  const [elementsForPage, setElementsForPage] = React.useState([]);
  const [pagesNumber, setPagesNumber] = React.useState([]);
  let pagesQuantity = 0;
  let pages = [];
  let page = 1;
  const [validity, setValidity] = React.useState({
    formErrors: {
      date: "",
      name: "",
      quantity: "",
      distance: "",
      formValid: false,
    },
    nameValid: false,
    dateValid: false,
    quantityValidReg: false,
    distanceValid: false,
  });

  const [data, setData] = React.useState({
    name: "",
    date: "",
    quantity: "",
    distance: "",
    value: "",
  });

  const [dataFilter, setDataFilter] = React.useState({
    nameOfCol: "",
    filter: "",
    value: "",
  });

  const [currentElement, setCurrentElement] = React.useState({
    name: "",
    date: "",
    quantity: "",
    distance: "",
    id: "",
  });

  const [element, setElement] = React.useState({
    name: "",
    date: "",
    quantity: "",
    distance: "",
  });

  React.useEffect(() => {
    document.title = `Welbex`;
  });

  React.useEffect(() => {
    api
      .getElements()
      .then((data) => {
        setElements(data);
      })
      .catch((err) => {
        console.log(`упс, возникла ошибка! ${err}}`);
      });
  }, []);

  React.useEffect(() => {
    if (elements.length !== 0) {
      pagination(elements);
    }
  }, [elements, changes]);

  function validateField(fieldName, value) {
    let fieldValidationErrors = validity.formErrors;
    let nameValid = validity.name;
    let dateValid = validity.date;
    let quantityValid = validity.quantity;
    let distanceValid = validity.distance;
    switch (fieldName) {
      case "name":
        const letters = /^[A-Za-zА-Яа-яё -]+$/;
        if (value.length <= 2) {
          nameValid = value.length <= 2;
          fieldValidationErrors.name = nameValid
            ? "название слишком короткое"
            : "";
        }
        if (value.length === 0) {
          nameValid = true;
          fieldValidationErrors.name = "";
        }
        if (value.length > 2 && value.length < 30) {
          if ((nameValid = value.match(letters))) {
            nameValid = false;
            fieldValidationErrors.name = "";
          } else {
            nameValid = true;
            fieldValidationErrors.name =
              "название должно содержать только латиницу, кирилицу, пробел и дефис";
          }
        }
        break;
      case "date":
        const dataReg =
          /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
        dateValid = value.match(dataReg);
        fieldValidationErrors.date = dateValid ? "" : "введите дату корректно";
        if (value.length === 0) {
          fieldValidationErrors.date = "";
        }
        break;
      case "quantity":
        const numberReg = /[0-9]/;
        quantityValid = value.match(numberReg);
        fieldValidationErrors.quantity = quantityValid
          ? ""
          : "введите корректное число";
        if (value.length === 0) {
          quantityValid = false;
          fieldValidationErrors.quantity = "";
        }
        break;
      case "distance":
        const numbersReg = /[0-9]/;
        distanceValid = value.match(numbersReg);
        fieldValidationErrors.distance = distanceValid
          ? ""
          : "введите корректное число";
        if (value.length === 0) {
          distanceValid = false;
          fieldValidationErrors.distance = "";
        }
        break;
      default:
        break;
    }

    setValidity({
      formErrors: fieldValidationErrors,
      name: nameValid,
      date: dateValid,
      quantity: quantityValid,
      distance: distanceValid,
      formValid: nameValid && dateValid && quantityValid && distanceValid,
    });
  }

  function pagination(array) {
    console.log(array)
    if (array.length === 0) {
      setElementsForPage([]);
      setPagesNumber([])
      return;
    }
    pagesQuantity = Math.trunc(array.length / 10);
    if (Math.trunc(array.length / 10) > 0) {
      pagesQuantity++;
    }
    for (let i = 0; i < pagesQuantity; i++) {
      pages[i] = page;
      page++;
    }
    setPagesNumber(pages);
    let newArray = [];
    for (let j = 0; j < array.length; j++) {
      newArray[j] = array[j];
    }
    setElementsForPage(newArray);
  }

  function clickOnElement(element) {
    setCurrentElement({
      id: element,
    });
    setIsElementClicked(true);
  }

  function showPage(element) {
    let array = [];
    let i = element === 1 ? 0 : (element - 1) * 10;
    for (let j = 0; j < 10; j++) {
      if (elements[i] === undefined) {
        setElementsForPage(array);
        return;
      }
      array[j] = elements[i];
      i++;
    }
    setElementsForPage(array);
  }

  function deleteElement(id) {
    api
      .removeElement(id)
      .then(() => {
        setElements((state) => state.filter((c) => c._id !== id));
      })
      .catch((err) => {
        console.log(`упс, возникла ошибка! ${err}`);
      });
  }

  function addElement(data) {
    api
      .addElement(data)
      .then((newElement) => {
        setElements([newElement, ...elements]);
      })
      .catch((err) => {
        console.log(`упс, возникла ошибка! ${err}`);
      });
  }

  function filter() {
    if (dataFilter.nameOfCol === "distance") {
      if (dataFilter.filter === ">") {
        setElementsForPage(
          elements.filter((element) => element.distance > dataFilter.value)
        );
        pagination(
          elements.filter((element) => element.distance > dataFilter.value)
        );
      }
      if (dataFilter.filter === "<") {
        setElementsForPage(
          elements.filter((element) => element.distance < dataFilter.value)
        );
        pagination(
          elements.filter((element) => element.distance < dataFilter.value)
        );
      }
      if (dataFilter.filter === "===") {
        setElementsForPage(
          elements.filter((element) => String(element.distance) === dataFilter.value)
        );
        pagination(
          elements.filter((element) => String(element.distance) === dataFilter.value)
        );
      }
      if (dataFilter.filter === "contains") {
        setElementsForPage(
          elements.filter((element) =>
            String(element.distance).includes(String(dataFilter.value))
          )
        );
        pagination(
          elements.filter((element) =>
            String(element.distance).includes(String(dataFilter.value))
          )
        );
      }
    }
    if (dataFilter.nameOfCol === "quantity") {
      if (dataFilter.filter === ">") {
        setElementsForPage(elements.filter((element) => element.quantity > dataFilter.value));
        pagination(elements.filter((element) => element.quantity > dataFilter.value));
      }
      if (dataFilter.filter === "<") {
        setElementsForPage(elements.filter((element) => element.quantity < dataFilter.value));
        pagination(elements.filter((element) => element.quantity < dataFilter.value));
      }
      if (dataFilter.filter === "===") {
        setElementsForPage(elements.filter((element) => String(element.quantity) === dataFilter.value));
        pagination(elements.filter((element) => String(element.quantity) === dataFilter.value));
      }
      if (dataFilter.filter === "contains") {
        setElementsForPage(
          elements.filter((element) =>
            String(element.quantity).includes(String(dataFilter.value))
          )
        );
        pagination(
          elements.filter((element) =>
            String(element.quantity).includes(String(dataFilter.value))
          )
        );
      }
    }
    if (dataFilter.nameOfCol === "name") {
      if (dataFilter.filter === ">") {
        setElementsForPage(
          elements.filter((element) => element.name > dataFilter.value)
        );
        pagination(
          elements.filter((element) => element.name > dataFilter.value)
        );
      }
      if (dataFilter.filter === "<") {
        setElementsForPage(
          elements.filter((element) => element.name < dataFilter.value)
        );
        pagination(
          elements.filter((element) => element.name < dataFilter.value)
        );
      }
      if (dataFilter.filter === "===") {
        setElementsForPage(
          elements.filter((element) => String(element.name) === dataFilter.value)
        );
        pagination(
          elements.filter((element) => String(element.name) === dataFilter.value)
        );
      }
      if (dataFilter.filter === "contains") {
        setElementsForPage(
          elements.filter((element) => element.name.includes(dataFilter.value))
        );
        pagination(
          elements.filter((element) => element.name.includes(dataFilter.value))
        );
      }
    }
  }

  function sortName() {
    let array = elements;
    array.sort((a, b) => (a.name > b.name ? 1 : -1));
    setElements(array);
    setChanges(changes + 1);
  }

  function sortQuantity() {
    let array = elements;
    array.sort((a, b) => (a.quantity > b.quantity ? 1 : -1));
    setElements(array);
    setChanges(changes + 1);
  }

  function sortDistance() {
    let array = elements;
    array.sort((a, b) => (a.distance > b.distance ? 1 : -1));
    setElements(array);
    setChanges(changes + 1);
  }

  return (
    <CurrentElementContext.Provider value={currentElement}>
      <div className="page">
        <Switch>
          <Route path="/">
            <Table
              isElementClicked={isElementClicked}
              addElement={addElement}
              validity={validity}
              validateField={validateField}
              data={data}
              setData={setData}
              deleteElement={deleteElement}
              clickOnElement={clickOnElement}
              elements={elements}
              setElements={setElements}
              setElement={setElement}
              element={element}
              data={data}
              setData={setData}
              pages={pages}
              showPage={showPage}
              elementsForPage={elementsForPage}
              pagesNumber={pagesNumber}
              dataFilter={dataFilter}
              setDataFilter={setDataFilter}
              filter={filter}
              sortName={sortName}
              sortDistance={sortDistance}
              sortQuantity={sortQuantity}
              validity={validity}
              validateField={validateField}
            />
          </Route>
          <Route path="*">
            <Error404 />
          </Route>
        </Switch>
      </div>
    </CurrentElementContext.Provider>
  );
}

export default App;

function Sort(props) {

  function handleChange(e) {
    const { name, value } = e.target;
    props.setDataFilter({
      ...props.dataFilter,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.filter();
  }

  return (
    <div className="sort">
      <form
        onSubmit={handleSubmit}
        className="sort__form"
        name="sort__form"
        id="sort__form"
        noValidate
      >
        <h1 className="sort__header">Фильтр таблицы</h1>
        <select className="sort__select" size="1" name="nameOfCol" onChange={handleChange}>
          <option>Выберите колонку</option>
          <option value="name">Название</option>
          <option value="quantity">Количество</option>
          <option value="distance">Расстояние</option>
        </select>
        <select className="sort__select" size="1" name="filter" onChange={handleChange}>
          <option>Выберите фильтр</option>
          <option value=">">Больше</option>
          <option value="<">Меньше</option>
          <option value="===">Равно</option>
          <option value="contains">Содержит</option>
        </select>
          <input
            onChange={handleChange}
            placeholder="Значение"
            value={props.dataFilter.value}
            className="sort__input"
            required
            name="value"
          />
          <button className="sort__button" disabled={!props.dataFilter.value} onClick={() => {props.filter()}}>
            Фильтр
          </button>
      </form>
    </div>
  );
}

export default Sort;

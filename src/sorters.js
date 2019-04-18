import Sorter from './sorter';
import {eventsBlock, renderEventsViaDays} from './events';
import {filteredEvents} from './filters';
import {eventsToSort} from './main';

// Виды сортировки
const sortersNames = [`Event`, `Time`, `Price`];
let sorterNameToFilter = `sorting-event`;

// Генерируем данные о блоке сортировки
const getSorterBlockData = (names) => {
  const sorterBlockData = {
    sorters: []
  };
  for (const name of names) {
    const sorter = {
      name,
      isChecked: false
    };
    sorterBlockData.sorters.push(sorter);
  }

  sorterBlockData[`sorters`][0].isChecked = true;
  return sorterBlockData;
};

const sortEvents = (events, sorterName) => {
  let sortedEvents = null;
  let eventsCopy = events;

  switch (sorterName) {
    case `sorting-price`:
      sortedEvents = eventsCopy.sort((a, b) => b.price - a.price);
      break;
    case `sorting-time`:
      sortedEvents = eventsCopy.sort((a, b) => b.startDate - a.startDate);
      break;
    default:
      sortedEvents = eventsCopy.sort((a, b) => a.id - b.id);
  }

  return sortedEvents;
};
// Создаем блок сортировки
const createSorterBlockElement = (sorter) => {
  const sorterComponent = new Sorter(sorter);

  // Сортируем эвенты
  sorterComponent.onSorter = (evt) => {
    const sorterName = evt.target.id;
    sorterNameToFilter = sorterName;
    const sortedEvents = filteredEvents.length === 0 ? sortEvents(eventsToSort, sorterName) : sortEvents(filteredEvents, sorterName);
    eventsBlock.innerHTML = ``;
    renderEventsViaDays(sortedEvents);
  };

  const sorterBlockElement = sorterComponent.render();
  return sorterBlockElement;
};

// Рендрим блок фильтров
const renderSorterBlockElement = (container) => {
  const sorterBlockData = getSorterBlockData(sortersNames);
  const sorterBlockElement = createSorterBlockElement(sorterBlockData);
  container.prepend(sorterBlockElement);
};

export {renderSorterBlockElement};
export {sortEvents};
export {sorterNameToFilter};

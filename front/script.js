const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');
const deleteListBtn = document.getElementById('delete-list-btn');
const refreshBtn = document.getElementById('refresh-btn');

const mainURL = 'https://viktor-indie.com/list';
// 'http://192.168.1.246:2604'
//'https://worried-jumpsuit-toad.cyclic.app';

const fetchList = async () => {
  const response = await fetch(`${mainURL}/list`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS, PUT, HEAD',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-Requested-With',
    },
  });

  const list = await response.json();

  while (listContainer.firstChild) {
    listContainer.removeChild(listContainer.lastChild);
  }

  if (!list.length) return;

  for (let i = 0; i < list.length; i += 1) {
    addItem(list[i].title, list[i].isDone);
  }
};

const deleteList = async () => {
  await fetch(`${mainURL}/list`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS, PUT, HEAD',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-Requested-With',
    },
  });
  fetchList();
};

const createArrayFromUl = () => {
  const result = [];
  const listItems = listContainer.getElementsByTagName('li');

  for (let i = 0; i < listItems.length; i++) {
    result.push({
      title: listItems[i].textContent.slice(0, -1),
      isDone: listItems[i].className === 'checked',
    });
  }

  return result;
};

const saveList = async () => {
  const updatedList = createArrayFromUl();

  await fetch(`${mainURL}/list`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ listData: updatedList }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS, PUT, HEAD',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-Requested-With',
    },
  });
};

const addItem = (item, isDone) => {
  if (item === '') return;
  let li = document.createElement('li');
  li.innerHTML = item;
  if (isDone) li.classList.toggle('checked');
  listContainer.appendChild(li);

  let span = document.createElement('span');
  span.innerHTML = '\u00d7';
  li.appendChild(span);
  inputBox.value = '';
};

const handleClick = (event) => {
  if (event.target.tagName === 'LI') {
    event.target.classList.toggle('checked');
  } else if (event.target.tagName === 'SPAN') {
    event.target.parentElement.remove();
  }
};

const handleRefreshClick = () => {
  fetchList();
};

fetchList();

listContainer.addEventListener('click', handleClick);

deleteListBtn.addEventListener('click', deleteList);

refreshBtn.addEventListener('click', handleRefreshClick);

saveBtn.addEventListener('click', saveList);

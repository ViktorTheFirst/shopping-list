var inputBox = document.getElementById('input-box');
var listContainer = document.getElementById('list-container');
var addBtn = document.getElementById('add-btn');
var saveBtn = document.getElementById('save-btn');
var deleteListBtn = document.getElementById('delete-list-btn');
var refreshBtn = document.getElementById('refresh-btn');

var mainURL =
  /* 'http://localhost:2604'; */ 'https://worried-jumpsuit-toad.cyclic.app';

const fetchList = async () => {
  const response = await fetch(`${mainURL}/list`, {
    mode: 'no-cors',
  });
  const list = await response.json();

  while (listContainer.firstChild) {
    listContainer.removeChild(listContainer.lastChild);
  }

  if (!list.length) return;

  for (var i = 0; i < list.length; i += 1) {
    addItem(list[i].title, list[i].isDone);
  }
};

async function deleteList() {
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
  alert('List was deleted');
  fetchList();
}

function createArrayFromUl() {
  var result = [];
  var listItems = listContainer.getElementsByTagName('li');

  for (var i = 0; i < listItems.length; i++) {
    result.push({
      title: listItems[i].textContent.slice(0, -1),
      isDone: listItems[i].className === 'checked',
    });
  }

  return result;
}

async function saveList() {
  var updatedList = createArrayFromUl();

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
}

function addItem(item, isDone) {
  if (item === '') return;
  var li = document.createElement('li');
  li.innerHTML = item;
  if (isDone) li.classList.toggle('checked');
  listContainer.appendChild(li);

  var span = document.createElement('span');
  span.innerHTML = '\u00d7';
  li.appendChild(span);
  inputBox.value = '';
}

function handleClick(event) {
  if (event.target.tagName === 'LI') {
    event.target.classList.toggle('checked');
  } else if (event.target.tagName === 'SPAN') {
    event.target.parentElement.remove();
  }
}

function handleRefreshClick() {
  fetchList();
}

fetchList();

listContainer.addEventListener('click', handleClick);

deleteListBtn.addEventListener('click', deleteList);

refreshBtn.addEventListener('click', handleRefreshClick);

saveBtn.addEventListener('click', saveList);

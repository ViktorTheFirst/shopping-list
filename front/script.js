const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');
const deleteListBtn = document.getElementById('delete-list-btn');
const confirmDeleteListBtn = document.getElementById('confirm-delete-btn');
const refreshBtn = document.getElementById('refresh-btn');
const modal = document.getElementById('myModal');
const kuzminImage = document.getElementById('kuzmin-img');
const closeIcon = document.getElementsByClassName('close')[0];

const mainURL = 'http://localhost:2604/list'; //'https://viktor-indie.com/list';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS, PUT, HEAD',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With',
};

const images = ['kuzmin1', 'kuzmin2', 'kuzmin3'];

const fetchList = async () => {
  const response = await fetch(`${mainURL}`, {
    method: 'GET',
    mode: 'cors',
    headers: corsHeaders,
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

const confirmDeleteList = async () => {
  await fetch(`${mainURL}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: corsHeaders,
  });
  modal.style.display = 'none';
  fetchList();
};

const deleteList = async () => {
  kuzminImage.src = getRandomImage();
  modal.style.display = 'block';
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

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * images.length);
  const imgName = images[randomIndex];
  return 'images/' + imgName + '.png';
};

const saveList = async () => {
  const updatedList = createArrayFromUl();

  await fetch(`${mainURL}`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ listData: updatedList }),
    headers: corsHeaders,
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

const onModalClose = () => {
  modal.style.display = 'none';
};

const handleRefreshClick = () => {
  fetchList();
};

fetchList();

// prevents scrolling on IOS
document.ontouchmove = function (event) {
  event.preventDefault();
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

listContainer.addEventListener('click', handleClick);

deleteListBtn.addEventListener('click', deleteList);

confirmDeleteListBtn.addEventListener('click', confirmDeleteList);

refreshBtn.addEventListener('click', handleRefreshClick);

closeIcon.addEventListener('click', onModalClose);

saveBtn.addEventListener('click', saveList);

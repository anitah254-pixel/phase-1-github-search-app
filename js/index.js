let name = "";

document.addEventListener("DOMContentLoaded", init);

function init() {
  const formEl = document.querySelector("form#github-form");
  const inputEl = formEl.querySelector("input#search");
  const userListEl = document.querySelector("ul#user-list");
  const repoListEl = document.querySelector("ul#repos-list");
  const fragment = document.createDocumentFragment();

  // On submit, search GitHub for user matches
  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    name = inputEl.value;
    inputEl.value = "";

    searchApiByName(name)
      .then((response) => response.json())
      .then((data) => {
        createUserEls(data.items);
        updateUserListEl();
        clearRepoList();
      });
  });

  // Functionality to show a user's list of repositories
  userListEl.addEventListener("click", (event) => {
    if (event.target.matches("button")) {
      showRepositories(event.target.dataset.login)
        .then((response) => response.json())
        .then((data) => {
          repoListEl.innerHTML = null;
          createRepoEls(data);
          updateRepoListEl();
          scrollViewToRepoList();
        });
    }
  });

  // Utilitfy functions
  function searchApiByName(name) {
    return fetch(`https://api.github.com/search/users?q=${name}`);
  }

  function createUserEl(user) {
    const userEl = document.createElement("li");

    const card = document.createElement("div");

    const img = document.createElement("img");
    img.setAttribute("src", user.avatar_url);
    card.appendChild(img);

    const cardBody = document.createElement("div");
    card.appendChild(cardBody);

    const link = document.createElement("a");
    link.setAttribute("href", user.html_url);
    link.setAttribute("target", "_blank");
    link.textContent = user.login;

    const cardTitle = document.createElement("h5");
    cardTitle.appendChild(link);

    const button = document.createElement("button");
    button.textContent = "Show Repositories";
    button.dataset.login = user.login;

    cardBody.append(cardTitle, button);
    card.appendChild(cardBody);

    userEl.appendChild(card);

    fragment.appendChild(userEl);
  }

  function createUserEls(users) {
    for (const user of users) {
      createUserEl(user);
    }
  }

  function updateUserListEl() {
    userListEl.innerHTML = null;
    userListEl.appendChild(fragment);
  }

  function showRepositories(login) {
    return fetch(`https://api.github.com/users/${login}/repos`);
  }

  function createRepoEl(repo) {
    const repoEl = document.createElement("li");
    repoEl.style.width = "18rem";

    const card = document.createElement("div");

    const cardBody = document.createElement("div");

    const link = document.createElement("a");
    link.setAttribute("href", repo.html_url);
    link.setAttribute("target", "_blank");
    link.textContent = repo.name;

    const cardTitle = document.createElement("h5");
    cardTitle.appendChild(link);

    const cardText = document.createElement("p");
    cardText.textContent = repo.description;

    cardBody.append(cardTitle, cardText);
    card.appendChild(cardBody);

    repoEl.appendChild(cardBody);

    fragment.appendChild(repoEl);
  }

  function createRepoEls(repos) {
    for (const repo of repos) {
      createRepoEl(repo);
    }
  }

  function updateRepoListEl() {
    repoListEl.innerHTML = null;
    repoListEl.appendChild(fragment);
  }

  function scrollViewToRepoList() {
    repoListEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearRepoList() {
    repoListEl.innerHTML = null;
  }
}

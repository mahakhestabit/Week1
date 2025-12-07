# GitHub API Analysis Results

## Task 1: User Headers (https://api.github.com/users/octocat)

* **Rate-limit remaining:** 54
* **ETag:** W/"147f22aa3bf3ea7b37a72a0a85374c633fa070a936b4fbdced25f893129a5711"
* **Server header:**  github.com

## Task 2: Pagination Fetch (https://api.github.com/users/octocat/repos?page=1&per_page=5)

* **Link headers:** <https://api.github.com/user/583231/repos?page=2&per_page=5>; rel="next", <https://api.github.com/user/583231/repos?page=2&per_page=5>; rel="last"

* **Navigating pages (rel="next" URL):** https://api.github.com/user/583231/repos?page=2&per_page=5


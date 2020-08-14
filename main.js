document.addEventListener('DOMContentLoaded',function() {
    
    const headerImg = document.querySelector('.header-img');
    
    if (window.innerWidth < 450) {
        headerImg.setAttribute('src','images/bg-header-mobile.svg');
    }

    const jobs = Array.from(document.querySelectorAll('.job-item'));

    $('span.clear').on('click',function() {
        $('div.categories').empty();
        $('div.filter-box').css('display','none');
        appendNewElements(jobs);
    });

    function createCategory(name) {
        const box = document.createElement('div');
        box.className = 'box';

        const categoryName = document.createElement('p');
        categoryName.className = 'name';
        categoryName.textContent = name;

        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'delete';
        deleteBtn.innerHTML = `<span class="del-btn">X</span>`;

        box.appendChild(categoryName);
        box.appendChild(deleteBtn);

        return box;
    }

    function populateFilterBox(box) {
        const filterBox = document.querySelector('.categories');
        filterBox.appendChild(box);
    }

    function createAndAppend(create,append) {
        return (elementName) => {
            const createdElement = create(elementName);
            append(createdElement);
        }
    }

    function alreadyExists(name) {
        const boxes = Array.from(document.querySelectorAll('.categories .box'));
        const categories = boxes.map((box) => {
            const category = box.querySelector('p.name').textContent;
            return category;
        });

        return categories.includes(name);
    }

    const composedFn = createAndAppend(createCategory,populateFilterBox);

    const filterContainer = document.querySelector('.filter-box');
    const categories = document.querySelectorAll('.other ul li');

    categories.forEach(li => {
        li.addEventListener('click',() => {
            if (!alreadyExists(li.textContent)) {
                filterContainer.style.display = 'block';
                composedFn(li.textContent);
                filterJobs(jobs);
            } else {
                return;
            }
        });
    });

    function grabCategories() {
        const boxes = Array.from(document.querySelectorAll('.categories .box'));
        const categories = boxes.map((box) => {
            const category = box.querySelector('p.name').textContent;
            return category;
        });

        return categories;
    }

    function hasCategory(category) {
        return function(domElement) {
            const cats = Array.from(domElement.querySelectorAll('.other ul li'));
            const transfromedCats = cats.map(cat => cat.textContent.trim());
            return transfromedCats.includes(category);
        }
    }

    function appendNewElements(newElements) {
        $('.listings').empty();
        newElements.forEach(el => $('.listings').append(el));
    }

    function filterJobs(originalJobs) {
        let criteria = grabCategories();
        if (criteria !== []) {
            let jobLists = originalJobs;

            let filteredJobs;

            for (let i = 0; i < criteria.length; i++) {
                filteredJobs = jobLists.filter(hasCategory(criteria[i]));
                jobLists = filteredJobs;
            };
            appendNewElements(jobLists);
        } else {
            appendNewElements(originalJobs);
        }
    }


    function spyChildren() {
        const itemsContainer = document.querySelector('.categories');
        const lenghtOfChildren = itemsContainer.children.length;

        if (lenghtOfChildren == 0) {
            itemsContainer.parentElement.parentElement.style.display = 'none';
        }
    }

    document.querySelector('body').addEventListener('click',function(e) {
        if (e.target.classList.contains('del-btn')) {
            const boxParent = e.target.parentElement.parentElement;
            const delParent = e.target.parentElement;
            boxParent.remove(delParent);
            spyChildren();
            filterJobs(jobs);
        }
    });


});
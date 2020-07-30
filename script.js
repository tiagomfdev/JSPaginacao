//mockando as informacoes para poder usar esta lista na paginacao
const data = Array.from({ length: 100 })
                  .map((_, i) => `Item ${(i + 1)}`) ;


//-------------------------------------------------------
 

const html = {
    get(element) {
        return document.querySelector(element);
    }
};

let perPage = 5;
const state = {
    page : 1,
    perPage,
    totalPage: Math.ceil( data.length / perPage ),
    maxVisibleButtons: 5
};

const controls = {

    next() {

        const lastPage = state.page === state.totalPage;

        if (lastPage) return;

        state.page++;
    },
    prev() {

        const firstPage = state.page === 1;

        if (firstPage) return;

        state.page--;
    },
    goTo(page) {

        if (page < 1 || page > state.totalPage) return;

        state.page = page;

    },
    createListeners() {
        html.get('.first')
            .addEventListener('click', () => { 
                this.goTo(1);
                update(); 
        });
        html.get('.last')
            .addEventListener('click', () => { 
                this.goTo(state.totalPage);
                update(); 
        });
        html.get('.next')
            .addEventListener('click', () => { 
                this.next();
                update(); 
        });
        html.get('.prev')
            .addEventListener('click', () => { 
                this.prev();
                update(); 
        });
    }

};

const list = {
    create(item) {
        const div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = item;

        html.get('.list').appendChild(div);
    },
    update() {
        html.get('.list').innerHTML = "";

        let page = state.page - 1;
        let start = page * state.perPage;
        let end = start + state.perPage;

        const paginatedItems = data.slice(start, end);

        paginatedItems.forEach(list.create);
    }
};

const buttons = {    
    element: html.get('.pagination .numbers'), 
    create(page) {

        const button = document.createElement('div');
        button.innerHTML = page;

        if (state.page === page){
            button.classList.add('active');
        }

        button.addEventListener('click', () => { 
            controls.goTo(page);
            update(); 
        });

        this.element.appendChild(button);
    },
    update() {
        this.element.innerHTML = "";

        const { maxLeft, maxRight } = this.calculateMaxVisible();
        
        for(let page = maxLeft; page <= maxRight; page++) {
            buttons.create(page);
        }
    },
    calculateMaxVisible() {
        const { maxVisibleButtons } = state;
        let maxLeft = (state.page - Math.floor(maxVisibleButtons / 2));
        let maxRight = (state.page + Math.floor(maxVisibleButtons / 2));

        if (maxRight > state.totalPage) {
            maxLeft = state.totalPage - ( maxVisibleButtons - 1 );
            maxRight = state.totalPage;
        }

        if(maxLeft < 1) {
            maxLeft = 1;
            maxRight = maxVisibleButtons;
        } 

        return {maxLeft, maxRight};
    }
}

const update = () => { 
    list.update();
    buttons.update(); 
};

const init = () => {
    list.update();
    buttons.update();
    controls.createListeners();
};

init();

class Good{
    constructor (id, name, description, sizes, price,){      
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = false;
    }
    setAvailable(available){
        this.available = available;
    }
}


class GoodsList {
    constructor(filter, sortPrice, sortDir) {
        this._goods = []
        this.filter = filter === undefined ? /./i: filter;
        this.sortDir = sortDir === undefined ? false: sortDir;
        this.sortPrice = sortPrice === undefined ? false: sortPrice;
    }  
    _find_index(id) {
        let index = this._goods.map((e, i) => [i, e]).filter(el => el[1].id === id)[0];
        if(index === undefined) {
            return -1;
        }
        return index[0];
    }
    _removeIndexOf(index) {
        this._goods.splice(index, 1);
    }

    get list() {

        let result = this._goods.filter(el => this.filter.test(el.name));
        if(!this.sortPrice) {
            return result;
        }

        if(this.sortDir) {
            return result.sort((el_1, el_2) => el_1.price - el_2.price);
        }
        return result.sort((el_1, el_2) => el_2.price - el_1.price);
    }

    add(good) {
        this._goods.push(good);
    }

    remove(id) {
        let index = this._find_index(id);;
        if( index === -1) {
            return
        }

        this._removeIndexOf(index);
    }
}

 
class BasketGood extends Good {
    constructor(id, name, description, sizes, price, amount) {
        super(id, name, description, sizes, price)
        this.amount = amount;
    }
}


class Basket extends GoodsList {
    constructor(filter, sortPrice, sortDir) {
        super(filter,sortPrice,sortDir)
    }

    get totalAmount() {
        return this._goods.reduce((accum, curr) => accum + curr.amount, 0);
    }

    get totalSum() {
        return this._goods.reduce((accum, curr) => accum + curr.amount * curr.price, 0);
    }

    add(good, amount) {
        let index = this._find_index(good.id);
        if(index === -1) {
            good.amount += amount;
            super.add(good);
            return;
        }

        this._goods[index].amount += amount;
    }

    remove(good, amount) {
        let index = this._find_index(good.id);
        if(index === -1) {
            return;
        }

        this._goods[index].amount -= amount;

        if(this._goods[index].amount <= 0) {
            super._removeIndexOf(index);
        }
    }

    clear() {
        this._goods = [];
    }

    removeUnavailable() {
        this._goods = this._goods.filter(el => el.available)
    }
}


function main() {
    let goods = [
        new Good(1, "Монитор", "Хороший монитор", [35, 36], 7000),
        new Good(2, "Мышка", "Хорошая мышка", [42, 46], 2000),
        new Good(3, "Клавиатура", "Хорошая клавиатура", [21, 22], 3000),
        new Good(4, "Коврик", "Хороший коврик",  [24, 25], 2500),
        new Good(5, "Сумка", "Хорошая сумка", [28, 29], 1000),
    ]

    let goodsList = new GoodsList();

    goodsList.add(goods[1]);
    goodsList.add(goods[3]);
    goodsList.add(goods[2]);

    console.log(goodsList.list);
    goodsList.filter = /а/i;
    console.log("Отфильтровано: ", goodsList.list);


    goodsList.remove(2);
    console.log(goodsList.list);

    goodsList.filter = /./i;
    console.log("Сортировка\n")
    goodsList.sortPrice = true;
    goodsList.sortDir = true;
    console.log(goodsList.list);

    let basket = new Basket();
    let basketGoods = [
        new BasketGood(1, "Монитор", "Хороший монитор", [35, 36], 7000, 5),
        new BasketGood(2, "Мышка", "Хорошая мышка", [42, 46], 2000, 4),
        new BasketGood(3, "Клавиатура", "Хорошая клавиатура", [21, 22], 3000, 7),
        new BasketGood(4, "Коврик", "Хороший коврик",  [24, 25], 2500, 9),
        new BasketGood(5, "Сумка", "Хорошая сумка", [28, 29], 1000, 11),
    ]

    basket.add(basketGoods[0], 5);
    console.log(basket.list);

    basket.remove(basketGoods[0], 3)
    console.log(basket.list);

    basket.remove(basketGoods[0], 100)
    console.log(basket.list);

    basket.add(basketGoods[1], 5);
    console.log(basket.list);
    console.log(basket.totalAmount, basket.totalSum);

    basket.removeUnavailable();
    console.log(basket.list);

    basket.add(basketGoods[1], 5);
    console.log(basket.list)

    basket.clear()
    console.log(basket.list);
}

main();
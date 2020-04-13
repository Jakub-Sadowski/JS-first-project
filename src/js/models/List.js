import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.items=[];
    };

    addItem(count,unit,ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }
    deleteItem(id){
        const index = this.items.findIndex(el => el.id === id)
        this.items.splice(index,1)         // usuwa z tablicy iles kolejnych elementow od el startowego -mutuje tablice a slice daje nową
    }

    updateCount(id,newCount){
        this.items.find(el=>el.id===id).count = newCount; //findIndex zwraca index a samo find zwraca obiekt
    }
}
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as likesView from './views/likesView';
import * as listView from './views/listView';
import {elements,renderLoader,clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

const state = {};

//SEARCH CONTROLLER

const controlSearch= async () =>{
    const query = searchView.getInput();
    if(query){
        state.search = new Search(query);
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try{
            await state.search.getResults();
            clearLoader();
            searchView.renderResults(state.search.result);
        }catch(err){
            console.log(err)
            clearLoader();
        }
       
    }
}

elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.addEventListener('click',e=>{
    const btn = e.target.closest('.btn-inline')
    if (btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage)
    }    
})

//RECIPE CONTROLLER
const controlRecipe = async () =>{
    const id = window.location.hash.replace('#',''); // ID Z URL
    if(id){
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if(state.search) searchView.highlightSelected(id);
        state.recipe = new Recipe(id);
        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        }catch(err)
        {
            console.log(err)
        }
        

    }
};
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); // GENIALNE- GDY DODAJEMY TEN SAM KONTROLER DO WIELU EVENTOW

const controlList = () =>{
    if(!state.list){
        state.list = new List();
    }

    state.recipe.ingredients.forEach(ing => {
       const item = state.list.addItem(ing.count,ing.unit,ing.ingredient);
       listView.renderItem(item);
    });
}

elements.shopping.addEventListener('click',e =>{
    const id = e.target.closest('.shopping__item').dataset.itemid;   // RObimy w htmlu data-zmienna bo mozemy uzywac dataset
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        console.log(`usun  ${id}`)
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

const controlLike=() =>{
    if(!state.likes) state.likes = new Likes();
    const currentID= state.recipe.id;
    if(!state.likes.isLiked(currentID)){
        const newLike = state.likes.addLike(currentID,state.recipe.title, state.recipe.author, state.recipe.img);
        likesView.toggleLikeBtn(true);
        likesView.renderLike(newLike);

    } else {
        state.likes.deleteLike(currentID);
        likesView.toggleLikeBtn(false);
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes);
}
window.addEventListener('load',()=>{
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like=> likesView.renderLike(like));
})

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings>1)
        state.recipe.updateServings('dec');
    }  else if(e.target.matches('.btn-increase, .btn-increase *')){     //dodajemy wszystkie childy zeby nie trzeba bylo idealnie klikac w 1 element
        state.recipe.updateServings('inc')
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
    recipeView.updateServingsIngredients(state.recipe);
})


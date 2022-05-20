import React, {useEffect, useReducer} from 'react';
import logo from './logo.svg';
import './App.css';

interface InitialState {
  counter: number;
  list: Character[];
  error: string;
  loading: boolean;
  favorite: Character[];
}

interface Character {
  id: number;
  created: string;
  episode: string[];
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  location:{
    name: string;
    url: string;
  }
}

type ActionType = {
  type: 'FETCH_CHARACTERS' | 'FETCH_CHARACTERS_SUCCESS' | 'FETCH_CHARACTERS_ERROR' | 'FETCH_CHARACTERS_NEXT' | 'FETCH_CHARACTERS_PREVIOUS' | 'ADD_FAVORITE';
  payload: Character[] | Character |boolean | string;
}

const initialState: InitialState = {
  counter: 1,
  list: [],
  error: '',
  loading: false,
  favorite: [],
};

function reducerRick(state: InitialState, action: ActionType) {
  switch (action.type) {
    case 'FETCH_CHARACTERS':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_CHARACTERS_SUCCESS':
      return {
        ...state,
        list: action.payload as Character[],
        loading: false,
      };
    case 'FETCH_CHARACTERS_ERROR':
      return {
        ...state,
        error: action.payload as string,
        loading: false
      };
    case 'FETCH_CHARACTERS_NEXT':
      if(state.counter < 43) {
        return {
          ...state,
          counter: state.counter + 1,
          error: '',
        };
      } else {
        return {
          ...state,
          error: 'No more characters'
        };
      }      
    case 'FETCH_CHARACTERS_PREVIOUS':
      if(state.counter > 1) {return {
        ...state,
        counter: state.counter - 1,
        error: '',
      };} else {
        return {
          ...state,
          error: 'No more characters'
        };
      }
    case 'ADD_FAVORITE': 
      return {
        ...state,
        favorite: [...state.favorite, action.payload as Character]
      }
    default:
      return state;
  }
}

function App() {

  const [state, dispatch] = useReducer(reducerRick, initialState);

  useEffect(() => {

    const fetchData = async (page:number ): Promise<Character[] | void > => {
      try {
        const result = await fetch(`https://rickandmortyapi.com/api/character/?page=${state.counter}`);
        const data = await result.json();
        return dispatch({
          type: 'FETCH_CHARACTERS_SUCCESS',
          payload: data.results,
        });
      } catch (error) {
        console.error(error,"error");
      }
    }
    fetchData(state.counter);

  }, [state.counter]);

  const fetchNext = () => {
    dispatch({
      type: 'FETCH_CHARACTERS_NEXT',
      payload: true,
    });
  }

  const fetchPrevious = () => {
    dispatch({
      type: 'FETCH_CHARACTERS_PREVIOUS',
      payload: true,
    });
  }

  return (
    <div style={{background:'gray', height:'100vh', width:'100vw'}}>
      <button onClick={fetchPrevious}>Previous</button>
      <button onClick={fetchNext}>Next</button>
      {state.error && <p>{state.error}</p>}
      {state.list.map((character: Character) => (
        <div key={character.id} style={{background:'white', height:'350px', width:'200px', margin:'10px'}}>
          <img src={character.image} alt={character.name}/>
          <p>{character.name}</p>
        </div>
      ))}
    </div>
  );
}

export default App;

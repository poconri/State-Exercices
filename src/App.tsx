import React, {useEffect, useReducer} from 'react';
import logo from './logo.svg';
import './App.css';

interface InitialState {
  counter: number;
  list: Character[] | [];
  error: string;
  loading: boolean;
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
  type: 'FETCH_CHARACTERS' | 'FETCH_CHARACTERS_SUCCESS' | 'FETCH_CHARACTERS_ERROR';
  payload?: Character[] | boolean | string;
}

const initialState: InitialState = {
  counter: 1,
  list: [],
  error: '',
  loading: false
};

function reducerRick(state: InitialState, action: ActionType) {
  console.log(state,"estado dentro de reducer");
  switch (action.type) {
    case 'FETCH_CHARACTERS':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_CHARACTERS_SUCCESS':
      console.log(state, action, "estado dentro del fetch")
      return {
        ...state,
        list: action.payload,
        loading: false
      };
    case 'FETCH_CHARACTERS_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
}

function App() {

  const [state, dispatch] = useReducer(reducerRick, initialState);

  useEffect(() => {

    console.log(state, "estado dentro de useEffect");
    const fetchData = async (page:number ): Promise<unknown> => {
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

  return (
    <div style={{background:'gray', height:'100vh', width:'100vw'}}>
      <button onClick={()=>{}}>Previous</button>
      <button onClick={()=>{}}>Next</button>
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

import { Component, useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { FoodsContainer } from './styles';
import {Food } from '../../components/Food';
import { ModalEditFood } from '../../components/ModalEditFood';
import { ModalAddFood } from '../../components/ModalAddFood';

type FoodType = {
  id: number,
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}
interface State {
  foods: FoodType[],
  editingFood?: FoodType,
  editModalOpen?: boolean,
  modalOpen: boolean,
}

// type StateData = Omit<State, 'modalOpen'>

export default function Dashboard() {

  const [state, setState] = useState<State>({foods:[], modalOpen: false});

 useEffect( () => {
   async function getFoods(){
     const response = await api.get('/foods');
     setState({foods: response.data,  modalOpen: false});
   }
   getFoods();
  }, [])

  async function handleAddFood(food: FoodType)  {
    const { foods } = state;

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setState({ foods: [...foods, response.data],  modalOpen: false });

    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodType)  {
    const { foods, editingFood } = state;

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood?.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setState({ foods: foodsUpdated,  modalOpen: false });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    const { foods } = state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setState({ foods: foodsFiltered,  modalOpen: false });
  }

  function toggleModal() {
    const { modalOpen } = state;
    setState({ foods: state.foods, modalOpen: !modalOpen });
    console.log('State', state);
  }

  function toggleEditModal() {
    const { editModalOpen } = state;

    setState({ foods: state.foods, editModalOpen: !editModalOpen,  modalOpen: true });
  }

  function handleEditFood(food: FoodType) {
    setState({ foods:state.foods, editingFood: food, editModalOpen: true,  modalOpen: true});
  }

  const { modalOpen, editModalOpen, editingFood, foods } = state;

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  }



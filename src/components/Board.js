import React, { Component } from 'react';
import './Board.css';
import List from './List';

class Board extends Component {
  constructor(props) {
    super(props);
    //LocalStorage is Used to Store Data in the Browser. 
    if (localStorage.getItem('lists')) {
      const rawList = localStorage.getItem('lists');
      const parsedList = JSON.parse(rawList);
      this.state = { lists: parsedList }
    } else {
      this.state = {
        lists: [
          {
            title: 'Backlog',
            id: 0,
            cards: [{
              taskText: 'Default task 1',
              listNumber: 0,
              timeId: 0
            },
            {
              taskText: 'Default task 2',
              listNumber: 0,
              timeId: 1
            }]
          },
          {
            title: 'ToDo',
            id: 1,
            cards: [{
              taskText: 'Default task 1',
              listNumber: 1,
              timeId: 2
            },
            {
              taskText: 'Default task 2',
              listNumber: 1,
              timeId: 3
            }]
          },
          {
            title: 'In Progress',
            id: 2,
            cards: [{
              taskText: 'Default task 1',
              listNumber: 2,
              timeId: 4
            },
            {
              taskText: 'Default task 2',
              listNumber: 2,
              timeId: 5
            }]
          },
          {
            title: 'Completed',
            id: 3,
            cards: [{
              taskText: 'Default task 1',
              listNumber: 3,
              timeId: 6
            },
            {
              taskText: 'Default task 2',
              listNumber: 3,
              timeId: 7
            }]
          }
        ]
      }

      localStorage.setItem('lists', JSON.stringify(this.state.lists))
    }
  }

  //get id of item being dragged and list where it's coming from
  onDragStart = (e, fromList) => {
    console.log(`what a drag!`)
    const dragInfo = {
      taskId: e.currentTarget.id,
      fromList: fromList
    }

    localStorage.setItem('dragInfo', JSON.stringify(dragInfo));
  }

  onDragOver = (e) => {
    e.preventDefault();
  }

  onDrop = (e, listNum) => {
    //get the dropped task card, the localStorage, 
    const droppedTask = localStorage.getItem('dragInfo');
    const rawList = localStorage.getItem('lists');
    const parsedList = JSON.parse(rawList);
    const parsedDragInfo = JSON.parse(droppedTask)

    //get task cards array, get rid of moved card, and put a new card
    // in the list where it was dropped
    const cardsArray = parsedList[parsedDragInfo.fromList].cards
    const taskCard = cardsArray.find(card => card.timeId == parsedDragInfo.taskId)
    const indexOfCard = cardsArray.findIndex(card => card.timeId == parsedDragInfo.taskId)
    parsedList[parsedDragInfo.fromList].cards.splice(indexOfCard, 1)
    parsedList[listNum].cards.push({ ...taskCard, listNumber: parseInt(listNum) })

    //sync the state and localStorage
    this.setState({
      lists: parsedList
    });
    localStorage.setItem('lists', JSON.stringify(parsedList));

  }

  //add some new task cards
  addTaskCard(taskText, listNumber) {
    const rawList = localStorage.getItem('lists');
    const parsedList = JSON.parse(rawList);

    const newTask = {
      taskText,
      listNumber,
      timeId: new Date().valueOf()
    }

    parsedList[listNumber].cards.push(newTask)

    //sync state and localStorage
    this.setState({
      lists: parsedList
    })
    localStorage.setItem('lists', JSON.stringify(parsedList))

  }


  render() {
    const lists = this.state.lists.map((list, index) => (
      <li className="list-wrapper" key={index}>
        <List {...list}
          onAdd={(taskText, listNumber) => this.addTaskCard(taskText, listNumber)}
          onDragStart={(e, fromList) => this.onDragStart(e, `${list.id}`)}
          onDragOver={(e) => this.onDragOver(e)}
          onDrop={(e, listNum) => { this.onDrop(e, `${list.id}`) }}
        />
      </li>
    ));

    return (
      <div className="board">
        <ul className="lists">
          {lists}
        </ul>
      </div>
    );
  }
}


export default Board;



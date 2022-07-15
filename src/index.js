import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {

    let classes = "border border-black w-20 aspect-square text-4xl " + props.squaresBackground;
    return ( 
        <button className = {classes} onClick ={props.onClick} > 
            {props.value} 
        </button>
    )
}

class Board extends React.Component{

  renderSquare(i){
      return <Square value={this.props.squares[i]} onClick={()=> this.props.onClick(i)} squaresBackground={this.props.squaresBackground[i]} />;
  }

  render(){
    return (
      <div className='grid gap-1 justify-center items-center'>
          <div className="grid gap-1 grid-cols-3 justify-center">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
          </div>
          <div className="grid gap-1 grid-cols-3 justify-center">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
          </div>
          <div className="grid gap-1 grid-cols-3 justify-center">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
          </div>
          <button className='border border-black h-10 font-bold bg-gray-200 hover:bg-gray-300 active:bg-gray-100' onClick={() => this.props.resetCmd()}>Restart</button>
      </div>
    );
  }
}

class Game extends React.Component{

  constructor(props){
    super(props);
    this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        squaresBackground: Array(9).fill("hover:bg-gray-100"),
        xIsNext:true,
        stepNumber: 0,
        count:9,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]){
      return;
    }

    squares[i] = this.state.xIsNext? 'X': 'O';
    this.setState({
        history:history.concat([{
          squares:squares,
        }]),
        stepNumber: history.length,
        xIsNext:!this.state.xIsNext,
        count: this.state.count-1,
    });

    this.colorSquares(calculateWinner(squares));
  }

  colorSquares(result){
    if(result){
      const squaresBackground = this.state.squaresBackground.slice();
      squaresBackground[result[1]] = squaresBackground[result[2]] = squaresBackground[result[3]] = "bg-green-100";
      this.setState({
        squaresBackground:squaresBackground,
      });

      return squaresBackground;
    }
  }

  jumpTo(step){
    const history = this.state.history;
    const current = history[step];

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      count: 9 - step,
      squaresBackground: calculateWinner(current.squares) ? this.colorSquares(calculateWinner(current.squares)) : Array(9).fill("hover:bg-gray-100"),
    })
  }

  resetClick(){
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      squaresBackground: Array(9).fill("hover:bg-gray-100"),
      xIsNext:true,
      stepNumber: 0,
      count:9,
    });
  }

  render(){
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;

    if (winner){
      status = '🎊 Winner: ' + winner[0] + ' 🎊';
    } else {
      if (this.state.count <= 0 ){
        status = 'Draw'
      }else{
        status = 'Next Player: ' + (this.state.xIsNext? 'X' : 'O');
      }
    }

    return(
        <div className='p-6 grid justify-center align-middle w-full gap-3'>
            <div className='text-center text-3xl w-full'>{status}</div>
            <div className=''>
                <Board 
                  squares = {current.squares}
                  onClick = {(i) => this.handleClick(i)}
                  squaresBackground = {this.state.squaresBackground}
                  resetCmd = {() => this.resetClick()}
                />
            </div>
            <div className='flex gap-1 outline outline-1 outline-black rounded'>
              <button className='bg-blue-500 text-white align-middle disabled:bg-gray-400 px-2 text-lg rounded' disabled={this.state.stepNumber === 0? true : false} onClick={() => this.jumpTo(this.state.stepNumber-1)}>&#8592;</button>
              <span className='flex-grow text-center'>{this.state.stepNumber === 0? 'Waiting': this.state.stepNumber}</span>
              <button className='bg-blue-500 text-white align-middle disabled:bg-gray-400 px-2 text-lg rounded' disabled={this.state.stepNumber === (this.state.history.length - 1) ? true : false} onClick={() => this.jumpTo(this.state.stepNumber+1)}>&#8594;</button>
            </div>
        </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a], a, b, c];
      }
    }
    return null;
}
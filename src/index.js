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
    constructor(props){
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            squaresBackground: Array(9).fill("hover:bg-gray-100"),
            xIsNext:true,
            count:9,
        }
    }

    handleClick(i) {
        const squares = this.state.squares.slice();

        if (calculateWinner(squares) || squares[i]){
          return;
        }

        squares[i] = this.state.xIsNext? 'X': 'O';
        this.setState({
            squares:squares,
            xIsNext:!this.state.xIsNext,
            count: this.state.count-1,
        });

        const winner = calculateWinner(squares);

        if(winner){
          const squaresBackground = this.state.squaresBackground.slice();
          squaresBackground[winner[1]] = squaresBackground[winner[2]] = squaresBackground[winner[3]] = "bg-green-100";
          this.setState({
            squaresBackground:squaresBackground,
          });
        }

    }

    resetClick(){
      this.setState({
        squares:Array(9).fill(null),
        squaresBackground: Array(9).fill("hover:bg-gray-100"),
        xIsNext:true,
        count:9,
      });
    }

    renderSquare(i){
        return <Square value={this.state.squares[i]} onClick={()=> this.handleClick(i)} squaresBackground={this.state.squaresBackground[i]} />;
    }

    render(){
        const winner = calculateWinner(this.state.squares);

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

        return (
            <div className='grid gap-1 justify-center items-center'>
                <div className='text-center text-3xl'>{status}</div>
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
                <button className='border border-black h-10 font-bold bg-gray-200 hover:bg-gray-300 active:bg-gray-100' onClick={() => this.resetClick()}>Restart</button>
            </div>
        );
    }
}

class Game extends React.Component{
    render(){
        return(
            <div className='p-6 grid align-middle w-full h-full'>
                <React.StrictMode>
                    <div className=''>
                        <Board />
                    </div>
                    <div className='ml-3'>
                        <div>{/* status */}</div>
                        <ol>{/* TODO */}</ol>
                    </div>
                </React.StrictMode>
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
import React from 'react';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

class Stock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockData: [],
      error: ''
    };
  }

  componentDidMount() {
    this.fetchStockData();
  }

  fetchStockData() {
    const API_KEY = '63adbcd3713841298131c0a21db4d767';//12d47a1130d34bb49e804b517716d010 //058d7c7a270b4dbf933e2277f01b5f6a //63adbcd3713841298131c0a21db4d767
    const nseCompanySymbols = [
       
      'INFY&exchange=NSE',
      'CCL&exchange=NYSE','TCS&exchange=NYSE','HAL&exchange=NYSE'
    ];

    const promises = nseCompanySymbols.map(symbol => {
      const API_Call = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=1&apikey=${API_KEY}`;

      return fetch(API_Call)
        .then(response => response.json())
        .then(data => {
          console.log(data);

          if (data.status === 'ok') {
            const latestData = data.values[0];
            const isUp = parseFloat(latestData.close) > parseFloat(latestData.open);
            return {
              symbol: data.meta.symbol,
              time: latestData.datetime,
              open: latestData.open,
              high: latestData.high,
              low: latestData.low,
              close: latestData.close,
              volume: latestData.volume,
              isUp: isUp
            };
          } else {
            throw new Error(`Failed to fetch data for symbol: ${symbol}`);
          }
        });
    });

    Promise.all(promises)
      .then(results => {
        this.setState({
          stockData: results,
          error: ''
        });
      })
      .catch(error => {
        this.setState({ error: error.message });
      });
  }

  render() {
    const { stockData, error } = this.state;

    return (
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          
          <TableRow>
            <TableCell align="center">Symbol</TableCell>
            <TableCell align="center">Time</TableCell>
            <TableCell align="center">Open</TableCell>
            <TableCell align="center">High</TableCell>
            <TableCell align="center">Low</TableCell>
            <TableCell align="center">Close</TableCell>

            <TableCell align="center">Volume</TableCell>

            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Details</TableCell>


          </TableRow>
          </TableHead>
        <TableBody>
          {stockData.map(stock =>(
            <TableRow
            key={stock.symbol}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center">{stock.symbol}</TableCell>
              <TableCell align="center">{stock.time}</TableCell>
              <TableCell align="center">{stock.open}</TableCell>
              <TableCell align="center">{stock.high}</TableCell>
              <TableCell align="center">{stock.low}</TableCell>
              <TableCell align="center">{stock.close}</TableCell>
              <TableCell align="center">{stock.volume}</TableCell>
              <TableCell align="center" style={{ color: stock.isUp ? 'green' : 'red' }}>
  {stock.isUp ? 'Up' : 'Down'}
</TableCell>              <TableCell align="center"><Link to={`/stock/${stock.symbol === 'INFY' ? 'INFY&exchange=NSE' : `${stock.symbol}&exchange=NYSE`}`}>View Details</Link></TableCell>

              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  
    );
  }
}

export default Stock;

import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Container,
  Typography,
  Paper,
  createTheme,
  ThemeProvider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

const StockDetail = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [stockDetails, setStockDetails] = useState({});
  const [detailsError, setDetailsError] = useState('');

  useEffect(() => {
    fetchStockDetail();
    fetchStockInfo();
  }, [symbol]);

  const fetchStockDetail = () => {
    setLoading(true);
    const API_KEY = '12d47a1130d34bb49e804b517716d010'; 
    const API_Call = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&outputsize=30&apikey=${API_KEY}`;

    fetch(API_Call)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          setStockData(data.values.reverse()); 
          setError('');
        } else {
          setError(`Failed to fetch data for symbol: ${symbol}`);
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchStockInfo = () => {
    const API_KEY = '12d47a1130d34bb49e804b517716d010';
    const API_Call = `https://api.twelvedata.com/stocks?symbol=${symbol}`;

    fetch(API_Call)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          setStockDetails(data.data[0]);
          setDetailsError('');
        } else {
          setDetailsError(`Failed to fetch details for symbol: ${symbol}`);
        }
      })
      .catch(error => {
        setDetailsError(error.message);
      });
  };

  const handleSearch = () => {
    return stockData.filter(
      (data) =>
        data.datetime.includes(search)
    );
  };

  const chartData = {
    labels: handleSearch().map(data => data.datetime),
    datasets: [
      {
        label: `${symbol} High Price`,
        data: handleSearch().map(data => parseFloat(data.high)),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)'
      },
      {
        label: `${symbol} Low Price`,
        data: handleSearch().map(data => parseFloat(data.low)),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)'
      }
    ]
  };

  return (
    <>
    <ThemeProvider theme={darkTheme}>
      <Container>
      {stockDetails && (
        <>
           <Typography variant="h4" style={{ margin: 18, fontFamily: "Montserrat" }}>
            Stock Details
          </Typography>
          <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }} align="center">Symbol</TableCell>
                  <TableCell align="center">{stockDetails.symbol}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }} align="center">Name</TableCell>
                  <TableCell align="center">{stockDetails.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }} align="center">Currency</TableCell>
                  <TableCell align="center">{stockDetails.currency}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }} align="center">Exchange</TableCell>
                  <TableCell align="center">{stockDetails.exchange}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }} align="center">Country</TableCell>
                  <TableCell align="center">{stockDetails.country}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }} align="center">Type</TableCell>
                  <TableCell align="center">{stockDetails.type}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          </>
        )}
        {error && <Typography variant="body1" color="error">{error}</Typography>}
        <div>
          <Typography variant="h6" style={{ margin: 20, fontFamily: "Montserrat" }}>
            Today's Price Movement
          </Typography>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Line data={chartData} />
          )}
        </div>
        {detailsError && <Typography variant="body1" color="error">{detailsError}</Typography>}
      </Container>
    </ThemeProvider>
    </>
  );
};

export default StockDetail;


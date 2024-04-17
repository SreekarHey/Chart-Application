import  { useEffect, useState } from 'react';
import { Drawer, Button, Select, MenuItem, AppBar, Toolbar, IconButton, Typography, FormControl, InputLabel } from '@mui/material/';
import MenuIcon from "@mui/icons-material/Menu";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import './App.css';

function App() {
const options = {
  chart: {
    type: 'column'
  },
  title: {
    text: 'Products in selected Category'
  },
  xAxis: {
    title: {
      text: 'iPhone Brand'
    },
    categories: ["iPhone 8", "iPhone X", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone SE"]
  },
  yAxis: {
    title: {
      text: 'Smartphones'
    },
    max: 800
  },
  series: [{
    name: 'iPhone',
    data: [300, 500, 700, 900, 1100, 1300, 200] 
  }]
}; 

  
  const [isOpen, setOpen] = useState(false);
  const [chartData, setChartData] = useState<any>(options);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState([]);


  const onReset = () => {
    setChartData(options);
    setSelectedCategory("");
    setSelectedProduct([]);
  };

  const handleCategoryChange = (event:any) => {
    setSelectedCategory(event.target.value); 
  };

  const handleProductChange = (event:any) => {
    setSelectedProduct(event.target.value); 
  };




  useEffect(()=>{
    if (selectedCategory) {
      fetch(`https://dummyjson.com/products/category/${selectedCategory}`)
        .then(res => res.json())
        .then(data => {
          console.log('Response:', data?.products);      
          const newOptions = {
            ...options,
            xAxis: {
              ...options.xAxis,
              categories: data?.products.map((product:any) => product.title)
            },
            series: [{
              ...options.series[0],
              data: data?.products.map((product:any) => product.stock)
            }]
          };
          console.log(newOptions,"newOptions");
          
          setChartData(newOptions);
          
        })
        .catch(error => console.error('Error fetching data:', error));
    } else {
      console.error('No category selected');
    }
  },[selectedCategory])
  
  useEffect(() => {
    // Fetch categories from the API
    fetch('https://dummyjson.com/products/categories/')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
      })
      .catch(error => console.error('Error fetching categories:', error));      
      
  }, []); 

  const onRunReport = (selectedProduct:any) => {
    if (selectedCategory) {
      fetch(`https://dummyjson.com/products/category/${selectedCategory}`)
        .then(res => res.json())
        .then(data => {
          console.log('Response:', data?.products);      
  
       
          const filteredProducts = data?.products.filter((product:any) => selectedProduct.includes(product.title));
  
          
          const newOptions = {
            ...options,
            xAxis: {
              ...options.xAxis,
              categories: filteredProducts.map((product:any) => product.title)
            },
            series: [{
              ...options.series[0],
              data: filteredProducts.map((product:any) => product.stock)
            }]
          };
  
          console.log(newOptions, "newOptions");
          setChartData(newOptions);
        })
        .catch(error => console.error('Error:', error));
    } else {
      console.error('No category selected');
    }
  };
  

 
  
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar variant="dense" onClick={() => setOpen(!isOpen)}>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography color="Dark" component="div" style={{ display: "flex", justifyContent: "center", width: "100%" }} >
            Product Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer open={isOpen} onClose={() => setOpen(false)}>
        <div style={{display:"flex",justifyContent:"center",alignItems: "end" }}>
          <h1 style={{ textAlign: "start" }}>Filters</h1>
          <Button onClick={onReset}>Clear</Button>
        </div>

   
        <FormControl sx={{ m: 2, minWidth: 200 }} size="small">
          <InputLabel id="demo-select-small-label">Select Category</InputLabel>
          <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={selectedCategory}
          label="Select Category"
          onChange={handleCategoryChange}
        >
          {categories.map(category => (
            <MenuItem key={category} value={category}>{category}</MenuItem>
          ))}
        </Select>
        </FormControl>

        <FormControl sx={{ m: 2, minWidth: 200 }} size="small">
          <InputLabel id="demo-select-small-label">Select Product</InputLabel>
          <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={selectedProduct}
          multiple
          disabled={!selectedCategory}
          label="Select Product"
          onChange={handleProductChange}
        >
          {chartData?.xAxis?.categories.map((category:any) => (
            <MenuItem key={category} value={category}>{category}</MenuItem>
          ))}
        </Select>
        </FormControl>
        <div style={{ display: "flex", justifyContent: "center", height: "100vh", alignItems: "center" }}>
        <Button onClick={()=>onRunReport(selectedProduct)} disabled={(selectedProduct && selectedCategory )===""} variant="contained">Run the report</Button>

        </div>
      </Drawer>
      <div style={{display:"flex",justifyContent:"center",alignItems: "center" ,height:"90vh"}}>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartData}
      />
      </div>
    </div>
  );
}

export default App;

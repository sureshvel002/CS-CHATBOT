import React, { useState } from "react";
import {Grid,Box,TextField,Paper,Typography,List,Button,Card, CardContent,Skeleton} from '@mui/material';
import Container from '@mui/material/Container';
import SendIcon from '@mui/icons-material/Send';


export const ChatBot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [botMessages, setBotMessages] = useState([]);
  const [loading,setLoading]=useState(false);

  const sendMessage = async () => {
    if (!userMessage.trim()) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/chat?message=${encodeURIComponent(userMessage)}`);
      const data = await response.json();
      setBotMessages(prevMessages => [
        ...prevMessages,
        { type: 'user', message: data.userMessage },
        { type: 'bot', message: data.botMessage }
      ]);
      setUserMessage('');
    } catch (error) {
      console.error('Error:', error);
      setBotMessages([...botMessages, { type: 'bot', message: "Sorry, something went wrong." }]);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <>
    <Container maxWidth="sm">
        <Box sx={{ height: '100vh'}}>
        <Paper square sx={{ pb: '50px' }}>
        <Typography variant="h5" gutterBottom component="div" sx={{ textAlign:'center',p: 2, pb: 0 }}>
        🤖 Chat with <span style={{ color: 'blue' }}>Customer Support Bot!</span>
        </Typography>
        <List sx={{ overflow: 'auto',height:'480px', maxHeight: '500px',marginBottom:'2px',m:1,borderRadius:12}}>
        {loading ? (
                <Skeleton animation="wave" height={100} />
              ) : (
        botMessages.map((msg, index) => (
          <Card sx={{maxWidth: 'fit-content',borderRadius:10, marginLeft: msg.type === 'user' ? 'auto' : '0',backgroundColor: msg.type === 'user' ? '#ffffff': '#1975D1',color: msg.type === 'user' ? '#1975D1': '#ffffff',marginBottom:1}}>
            <CardContent >
            {msg.type === 'user' && (
            <Typography variant="body2" sx={{ Width:'auto',textAlign: msg.type === 'user' ? 'left' : 'right'}} >
              {msg.message}
            </Typography>)}
            {msg.type === 'bot' && (
              <Typography variant="body2" sx={{ Width:'auto',textAlign: msg.type === 'user' ? 'left' : 'right'}} >
              {msg.message}
            </Typography>)}
            </CardContent>
          </Card>
          )))}
        </List>
      </Paper>
      <Grid container xs={12} sx={{marginTop:'10px',overflow:'hidden'}}>
        <Grid item xs={10} >
      <TextField fullWidth label="Ask your queries with me!"
      type="text"
      value={userMessage}
      onChange={(e) => setUserMessage(e.target.value)}
       />
      </Grid>
      <Grid item xs={2}>
      <Button variant="contained" onClick={sendMessage} sx={{height: '100%',marginLeft:'10px',borderRadius: 60}}>
      <SendIcon />
      </Button>
      </Grid>
      </Grid>
        </Box>
    </Container>
    </>
  );
};
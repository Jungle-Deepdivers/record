// const axios = require('axios');
// const fs = require('fs');

// const options = {
//   method: 'GET',
//   url: 'https://text-to-speech27.p.rapidapi.com/speech',
//   params: {
//     text: 'In this codelab, you will focus on using the Text-to-Speech API with Node.js. You will learn how to list available voices and also synthesize audio from text.',
//     lang: 'en-us'
//   },
//   responseType: 'arraybuffer', // 바이너리 응답 타입 설정
//   headers: {
//     'X-RapidAPI-Key': '2e96f24243msh7f6143aa20858b0p106911jsn9985f8d37834',
//     'X-RapidAPI-Host': 'text-to-speech27.p.rapidapi.com',
//     'Content-Type': 'application/octet-stream' // 바이너리 응답을 위한 Content-Type 설정
//   }
// };

// async function makeRequest() {
//   try {
//     const response = await axios.request(options);
//     const audioData = response.data;
//     fs.writeFileSync('output.mp3', audioData); // 음성 파일 저장
//     console.log('음성 파일이 성공적으로 생성되었습니다.');
//   } catch (error) {
//     console.error(error);
//   }
// }

// makeRequest();

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const options = {
  method: 'GET',
  url: 'https://text-to-speech27.p.rapidapi.com/speech',
  params: {
    lang: 'en-us'
  },
  responseType: 'arraybuffer',
  headers: {
    'X-RapidAPI-Key': '2e96f24243msh7f6143aa20858b0p106911jsn9985f8d37834',
    'X-RapidAPI-Host': 'text-to-speech27.p.rapidapi.com',
    'Content-Type': 'application/octet-stream'
  }
};
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/text-to-speech', async (req, res) => {
  const { text } = req.body;

  options.params.text = text;

  try {
    const response = await axios.request(options);
    const audioData = response.data;
    fs.writeFileSync('output.mp3', audioData);

    const fileStream = fs.createReadStream('output.mp3');
    fileStream.pipe(res); // MP3 파일 스트리밍

    console.log('음성 파일이 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error(error);
    res.status(500).send('음성 파일 생성 중 오류가 발생했습니다.');
  }
});

app.listen(3000, () => {
  console.log('서버가 3000번 포트에서 실행 중입니다.');
});

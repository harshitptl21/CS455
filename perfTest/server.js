import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1s', target: 1 },  
    { duration: '1s', target: 5 },  
    { duration: '1s', target: 10 }, 
    { duration: '1s', target: 5 },   
    { duration: '1s', target: 0 },   
  ],
  thresholds: {
    'http_req_duration': ['p(95)<2000'], 
    'http_req_failed': ['rate<0.01'],    
  },
};

const gameUrls = [
  "http://cs455.000.pe/", 
  "http://1cs455.000.pe/", 
  "http://cs455-backup.000.pe/"
];

const leaderboardUrl = "Game/get_scores.php";

export default function () {
  for (let gameUrl of gameUrls) {
    let gameResponse = http.get(gameUrl);
    check(gameResponse, {
      'Game page: status is 200': (r) => r.status === 200,
      'Game page: response time < 800ms': (r) => r.timings.duration < 800,
    });

    let leaderboardResponse = http.get(gameUrl + leaderboardUrl);
    check(leaderboardResponse, {
      'Leaderboard page: status is 200': (r) => r.status === 200,
      'Leaderboard page: response time < 800ms': (r) => r.timings.duration < 800,
    });

    sleep(1);
  }
}

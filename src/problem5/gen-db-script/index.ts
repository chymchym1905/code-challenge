import axios from 'axios';
import async, { AsyncResultCallback } from 'async';

const BASE_URL = 'http://localhost:3001/api';

async function registerUsers() {
    const password = 'utbt';
    const rankings = {};
    const registeredUsers: { name: string; email: string; password: string }[] = [];

    const tasks = Array.from({ length: 15 }, (_, i) => async (next: AsyncResultCallback<any>) => {
        try {
            const name = `john doe ${i + 1}`;
            const email = `user${i + 1}@example.com`;

            const body = {
                name,
                email,
                rankings,
                password
            };

            const response = await axios.post(`${BASE_URL}/user/register`, body);
            console.log(response.data);
            return next(null, { name, email, password });
        } catch (error: any) {
            return next(error);
        }
    });

    const results: any[] = await async.parallelLimit(tasks, 5);
    registeredUsers.push(...results);

    return registeredUsers;
}

async function loginUsers(users: { email: string; password: string }[]) {
    const authTokens: string[] = [];

    const task = users.map((user) => async (next: AsyncResultCallback<any>) => {
        try {
            const response = await axios.post(`${BASE_URL}/user/login`, {
                userEmail: user.email,
                password: user.password
            });
            console.log(response.data);
            return next(null, response.data.authToken);
        } catch (error: any) {
            return next(error);
        }
    });

    const results: any[] = await async.parallelLimit(task, 15);
    authTokens.push(...results);

    return authTokens;
}

async function createScores(authTokens: string[]) {
    const leaderboardId = 1; // Example leaderboard ID

    const task = authTokens.map((token) => async (next: AsyncResultCallback<any>) => {
        try {
            let score = Math.floor(Math.random() * 1000);
            const response = await axios.post(
                `${BASE_URL}/leaderboard/createscore`,
                {
                    leaderboardId,
                    score: score
                },
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            );
            console.log(response.data);
            return next(null, response.data);
        } catch (error: any) {
            return next(error);
        }
    });

    await async.parallelLimit(task, 15);
}

async function main() {
    console.log('Registering users...');
    const registeredUsers = await registerUsers();

    console.log('Logging in users...');
    const authTokens = await loginUsers(registeredUsers);

    console.log('Creating scores...');
    await createScores(authTokens);

    console.log('Script completed successfully!');
}

main();

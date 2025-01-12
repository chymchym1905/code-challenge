const privateRoutes = [
    '/api/leaderboard/createscore'
]

const PRIVATE_ROUTE = new RegExp(privateRoutes.join('|'));

export default PRIVATE_ROUTE;
# Backend

1.Mongostore
app.use(session({
    store: MongoStore.create({
    mongoUrl: 'mongodb://localhost/test-app',
    ttl: 14 * 24 * 60 * 60 // = 14 days. Default
  }),
  and other session related feilds
  }
));

2.Cors 
// Enable CORS (Cross-Origin Resource Sharing)
// - Allows frontend (http://localhost:5173) to communicate with backend
// - credentials: true allows cookies/sessions to be shared
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

3.Passport Authentication
User.register() → Helper from passport-local-mongoose to create a new user and automatically hash the password.
passport.authenticate() → Passport middleware that verifies login credentials using a chosen strategy (e.g. local).
req.login(user, cb) → Logs a user into the session manually after authentication.
req.logout(cb) → Logs the user out by removing them from the session.
req.isAuthenticated() → Returns true if the request has an active logged-in user.
# Backend Setup & Notes  

  //MongoStore (Session Storage)  
  app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost/test-app',
    ttl: 14 * 24 * 60 * 60 // = 14 days (default)
  }),
  // other session-related fields here
  }));

  // Enable CORS (Cross-Origin Resource Sharing)
  // - Allows frontend (http://localhost:5173) to communicate with backend
  // - credentials: true allows cookies/sessions to be shared
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));

  //Passport Authentication
  User.register() → Helper from passport-local-mongoose to create a new user and automatically hash the password.

  passport.authenticate() → Passport middleware that verifies login credentials using a chosen strategy (e.g., local).

  req.login(user, cb) → Logs a user into the session manually after authentication.

  req.logout(cb) → Logs the user out by removing them from the session.

  req.isAuthenticated() → Returns true if the request has an active logged-in user.

# Frontend Setup & Notes 

  Note:Include all the cdn in the index.html file

1.Context 
  a.createContext()
  b.useContext
  c.<contextName.Provider values={providerValues}>
2.React-router-dom
  a.Routes
  b.<Route path="path" element={<element_Name or the navigate to="/login>}
  c.Browser router 
  d.Navigate
  d.useNavigate()
3.Updating Objects in React State

- In React, state objects must not be mutated directly (no `formData.email = "new"`).  
- Instead, create a new object using the spread operator (`...`) and update only the needed field.
setFormData(prev => ({
  ...prev,        // copy all existing fields
  email: "abc@gmail.com"  // update only 'email'
}));
4.Cookie-session Management(between the user and the client) 
axios.get("http://localhost:3000/api/me", { withCredentials: true });
  

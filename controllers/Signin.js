// Reqest signin with input values, respond with user 
const handleSignin = (req, res, db, bcrypt) => {
	const { email, password } = req.body;
	// If any field in sig in form is empty, sign in is invalid	
	if (!email || !password) {
		return res.status(400).json('incorrect form submission');
	}

	// Select user from login table where email match
	db.select('email', 'hash').from('login')
	.where('email', '=', email)
	.then(data => {
		// Compare encrypted inputted password with stored encrypted password
		const isValid = bcrypt.compareSync(password, data[0].hash);
		// If comparison came back true, respond the user info from users table. 
		// Otherwise respond wrong credentials
		if (isValid) {
			return db.select('*').from('users')
			.where('email', '=', email)
			.then(user => {
				res.json(user[0]);	
			})
			.catch(err => res.status(400).json('unable to get user'));
		} else {
			res.status(400).json('wrong credentials');
		}		
	})
	// Error if email doesn't exist in login table
	.catch(err => res.status(400).json('wrong credentials'));
}

module.exports = {
	handleSignin: handleSignin
}
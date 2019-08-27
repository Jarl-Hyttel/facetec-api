// Reqest register with input values, respond with new user
const handleRegister = (req, res, db, bcrypt, saltRounds) => {
	const { email, name, password } = req.body;	
	// If any field in register form is empty, registration is invalid	
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}

	// Debugging to check input
	// console.log("email: " + email, "name: " + name, "password: " + password);

	// Hash inputted password
	const hash = bcrypt.hashSync(password, saltRounds);

	db.transaction(trx => {
		// Insert info into login table
		trx.insert({
			hash: hash,
			email: email,
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			// Insert info into users table
			return trx('users')
			.returning('*')
			.insert({
				email: loginEmail[0],
				name: name,
				joined: new Date(),
			})
			.then(user => {
				// Respond with new user
				res.json(user[0]);
			})
		})
		// Commit changes
		.then(trx.commit)
		// Rollback if error commiting
		.catch(trx.rollback);
	})
	.catch(err => res.status(400).json('unable to register'))
}

module.exports = {
	handleRegister: handleRegister
};
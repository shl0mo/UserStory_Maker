import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'

const PORT = 5000

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({
  extended: true
}))


const makeTasksTable = (tasksTableHeader, tasksLines) => {
	let tasksTable = tasksTableHeader
	for (const taskLine of tasksLines) {
		const word = taskLine.split(' ')
		const taskID = word[0]
		const taskDescription = word[1]
		const taskAssignment = word[2]
		tasksTable = tasksTable + `
			<tr>
				<td>
					${taskID}
				</td>
				<td>
					${taskDescription}
				</td>
				<td>
					${taskAssignment}
				</td>
			</tr>
		`
	}
	tasksTable = tasksTable + '</tbody>'
	return tasksTable
}

app.post('/makeREADME', (req, res) => {
	const title = req.body.title
	const interface_behavior = req.body.interfaceBehavior
	const observations = req.body.observations
	const frontendTasks = req.body.frontendTasks
	const backendTasks = req.body.backendTasks
	const tasksTableHeader = `
		<table>
			<thead>
				<th>ID</th>
				<th>Descrição</th>
				<th>Atribuição</th>
			</thead>
			<tbody>
	`
	const frontendTasksLines = frontendTasks.split('\n')
	const backendTasksLines = backendTasks.split('\n')
	const frontendTasksTable = makeTasksTable(tasksTableHeader, frontendTasksLines)
	const backendTasksTable = makeTasksTable(tasksTableHeader, backendTasksLines)
	const readmeString = backendTasksTable
	res.send(readmeString)
})


app.listen(PORT, () => console.log(`Server running on ${PORT}`))

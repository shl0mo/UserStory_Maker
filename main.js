import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import cors from 'cors'

const PORT = 5000

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cors())


const makeTasksTable = (tasksTableHeader, tasksLines) => {
	let tasksTable = tasksTableHeader
	for (const taskLine of tasksLines) {
		const word = taskLine.split(' ')
		const taskID = word[0]
		const taskDescription = word[1]
		const taskAssignment = word[2]
		if (taskID === '') continue
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
	tasksTable = tasksTable + `
			</tbody>
		</table>
	`
	return tasksTable
}

const getStringBetween = (char1, char2, text) => {
	return text.split(char1)[1].split(char2)[0]
}

const getTaskTableData = (tasksTableTbody, tasksDataArray) => {
	while (tasksTableTbody.includes('\t'))
		tasksTableTbody = tasksTableTbody.replace('\t', '')
	while (tasksTableTbody.includes('\n'))
		tasksTableTbody = tasksTableTbody.replace('\n', '')
	let i = 1
	while (tasksTableTbody.includes('</td><td>')) {
		const taskDescription = getStringBetween('</td><td>', '</td><td>', tasksTableTbody)
		const taskAssignment = getStringBetween('<a href="https://github.com/', '">', tasksTableTbody)
		tasksDataArray.push({
			taskDescription: taskDescription,
			taskAssignment: taskAssignment
		})
		tasksTableTbody = tasksTableTbody.replace(`</td><td>${taskDescription}</td><td>`, '')
		tasksTableTbody = tasksTableTbody.replace(`<a href="https://github.com/${taskAssignment}">`, '')
		i = i + 1
	}
}

app.post('/getFieldsData', (req, res) => {
	fs.readFile('README.md', 'utf-8', (error, data) => {
		if (error) res.status(500).json(error)
		const userStoryId = getStringBetween('[', ']', data)
		const title = getStringBetween(']: ', '\n', data)
		const userStory = getStringBetween('História de Usuário\n', '\n', data)
		let imageFieldsData = ''
		let interfaceBehavior = ''
		let comments = ''
		const frontendTasksData = []
		const backendTasksData = []
		if (data.includes('Modelo da Interface de Usuário')) {
			imageFieldsData = getStringBetween('Modelo da Interface de Usuário\n', '\n', data)
		} else if (data.includes('Modelos das Interfaces de Usuário')) {
			imageFieldsData = getStringBetween('Modelos das Interfaces de Usuário', '\n', data)
		}
		if (data.includes('Observações')) {
			interfaceBehavior = getStringBetween('Comportamento da Interface\n', '\n\n### Observações', data)
			comments = getStringBetween('### Observações\n\n', '\n\n## Tarefas', data)
		} else {
			interfaceBehavior = getStringBetween('Comportamento da Interface\n', '\n\n## Tarefas', data)
		}
		let frontendTasksTableTbody = getStringBetween('id="frontend-tasks-tbody">\n', '\n</tbody>', data)
		let backendTasksTableTbody = getStringBetween('id="backend-tasks-tbody">\n', '\n</tbody>', data)
		getTaskTableData(frontendTasksTableTbody, frontendTasksData)
		getTaskTableData(backendTasksTableTbody, backendTasksData)
		console.log(backendTasksData)
		console.log(frontendTasksData)
		res.send({
			userStoryId: userStoryId,
			title: title,
			userStory: userStory,
			imageFieldsData: imageFieldsData,
			interfaceBehavior: interfaceBehavior,
			frontendTasksData: frontendTasksData,
			backendTasksData: backendTasksData,
			comments: comments
		})
	})
})

app.post('/makeREADME', (req, res) => {
	const title = req.body.title
	const userStory = req.body.userStory
	const imageAlt = req.body.imageAlt
	const interfaceModelImageSrc = req.body.interfaceModelImageSrc
	const interfaceBehavior = req.body.interfaceBehavior
	const comments = req.body.comments
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
	let readmeString = `
		# ${title}
		## História do Usuário
		${userStory}
		## Modelo da Interface do Usuário
		[${imageAlt}](${interfaceModelImageSrc})
		## Comportamento da Interface
		${interfaceBehavior}
		### Observações
		${comments}
		## Tarefas
		### Frontend
		${frontendTasksTable}
		### Backend
		${backendTasksTable}
	`
	while (readmeString.includes('	')) readmeString = readmeString.replace('	', '')
	fs.writeFile('README.md', readmeString, (err) => {
		if (err) return res.status(500).json({ msg: "Erro ao tentar gerar README" })
		return res.status(200).json({ msg: "README gerado com sucesso" })
	})
})


app.listen(PORT, () => console.log(`Server running on ${PORT}`))

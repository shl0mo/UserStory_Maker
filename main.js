import express from 'express'
import bodyParser from 'body-parser'
import fs, { read } from 'fs'
import cors from 'cors'

const PORT = 5000

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cors())


const makeTasksTable = (userStoryId, readmeString, tasksArray, taskType) => {
	let taskTypePrefix = ''
	if (taskType == 'frontend') taskTypePrefix = 'FT'
	else taskTypePrefix = 'BT'
	for (let i = 0; i < tasksArray.length; i++) {
		const taskDescription = tasksArray[i].taskDescription
		const taskAssignment = tasksArray[i].taskAssignment
		let indexStr = String(i + 1)
		if (indexStr.length == 1) indexStr = `0${indexStr}`
		readmeString = readmeString + `
			<tr>
				<td>
					${userStoryId}-${taskTypePrefix}${indexStr}
				</td>
				<td>
					${taskDescription}
				</td>
				<td>
					<a href="https://github.com/${taskAssignment}">${taskAssignment}</a>
				</td>
			</tr>
		`
	}
	readmeString = readmeString + `
		</tbody>
		</table>
	`
	return readmeString
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
		if (error) return res.status(500).json(error)
		const userStoryId = getStringBetween('[', ']', data)
		const title = getStringBetween(']: ', '\n', data)
		const userStory = getStringBetween('História do Usuário\n', '\n', data)
		let imageFieldsString = ''
		let imageFieldsDataArray = []
		let interfaceBehavior = ''
		let comments = ''
		const frontendTasksData = []
		const backendTasksData = []
		if (data.includes('Modelo da Interface do Usuário')) {
			imageFieldsString = getStringBetween('Modelo da Interface do Usuário\n', '\n\n## Comportamento da Interface', data)
		} else if (data.includes('Modelos das Interfaces do Usuário')) {
			imageFieldsString = getStringBetween('Modelos das Interfaces do Usuário', '\n\n## Comportamento da Interface', data)
		}
		imageFieldsString.split('\n').map((imageFieldData) => {
			if (imageFieldData !== '') imageFieldsDataArray.push(imageFieldData)
		})
		if (data.includes('Observações')) {
			interfaceBehavior = getStringBetween('Comportamento da Interface\n', '\n\n### Observações', data)
			comments = getStringBetween('### Observações\n', '\n\n## Tarefas', data)
		} else {
			interfaceBehavior = getStringBetween('Comportamento da Interface\n', '\n\n## Tarefas', data)
		}
		let frontendTasksTableTbody = getStringBetween('id="frontend-tasks-tbody">\n', '\n</tbody>', data)
		let backendTasksTableTbody = getStringBetween('id="backend-tasks-tbody">\n', '\n</tbody>', data)
		getTaskTableData(frontendTasksTableTbody, frontendTasksData)
		getTaskTableData(backendTasksTableTbody, backendTasksData)
		return res.send({
			userStoryId: userStoryId,
			title: title,
			userStory: userStory,
			imageFieldsDataArray: imageFieldsDataArray,
			interfaceBehavior: interfaceBehavior,
			frontendTasksData: frontendTasksData,
			backendTasksData: backendTasksData,
			comments: comments
		})
	})
})

app.post('/makeREADME', (req, res) => {
	const title = req.body.title
	const userStoryId = getStringBetween('[', ']', title)
	const userStory = req.body.userStory
	const imageFieldsDataArray = req.body.imageFieldsDataArray
	const interfaceBehavior = req.body.interfaceBehavior
	const comments = req.body.comments
	const frontendTasksArray = req.body.frontendTasksArray
	const backendTasksArray = req.body.backendTasksArray
	const tasksTableHeader = `
		<table>
			<thead>
				<th>ID</th>
				<th>Descrição</th>
				<th>Atribuição</th>
			</thead>
	`
	let readmeString = `# ${title}
		## História do Usuário
		${userStory}
	`
	if (imageFieldsDataArray.length == 1) {
		readmeString = readmeString + `
			## Modelo da Interface do Usuário
		`
	} else {
		readmeString = readmeString + `
			## Modelos das Interfaces do Usuário
		`
	}
	for (let imageFieldDataArray of imageFieldsDataArray) {
		const imageDescription = imageFieldDataArray.imageDescription
		const imageSrc = imageFieldDataArray.imageSrc
		readmeString = readmeString + `
			![${imageDescription}](${imageSrc})
		`
	}
	readmeString = readmeString + `
		## Comportamento da Interface
		[[interface-Behavior-Section]]
	`
	if (comments !== '') {
		readmeString = readmeString + `
			### Observações
			${comments}
		`
	}
	readmeString = readmeString + `
		## Tarefas
		## Frontend
		${tasksTableHeader}
		<tbody id="frontend-tasks-tbody">
	`
	readmeString = makeTasksTable(userStoryId, readmeString, frontendTasksArray, 'frontend')
	readmeString = readmeString + `
		### Backend
		${tasksTableHeader}
		<tbody id="backend-tasks-tbody">
	`
	readmeString = makeTasksTable(userStoryId, readmeString, backendTasksArray, 'backend')
	while (readmeString.includes('	')) readmeString = readmeString.replace('	', '')
	readmeString = readmeString.replace('[[interface-Behavior-Section]]', interfaceBehavior)
	fs.writeFile('README.md', readmeString, (err) => {
		if (err) return res.status(500).json({ msg: "Erro ao tentar gerar README" })
		return res.status(200).json({ msg: "README gerado com sucesso" })
	})
})


app.listen(PORT, () => console.log(`Server running on ${PORT}`))

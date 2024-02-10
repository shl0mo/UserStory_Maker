function getFieldsData () {
    fetch('http://localhost:5000/getFieldsData', {
        method: 'POST',
    }).then((res) => {
        return res.json().then((data) => {
            const userStoryId = data.userStoryId
            const title = data.title
            const userStory = data.userStory
            const imageFieldsData = data.imageFieldsDataArray
            const interfaceBehavior = data.interfaceBehavior
            const comments = data.comments
            const frontendTasksData = data.frontendTasksData
            const backendTasksData = data.backendTasksData
            const titleField = document.querySelector('#title')
            const userStoryField = document.querySelector('#user-story')
            for (imageFieldData of imageFieldsData) {
                addImageInputsFields(imageFieldData)
            }
            const interfaceBehaviorField = document.querySelector('#interface-behavior')
            const commentsField = document.querySelector('#comments')
            titleField.value = `[${userStoryId}]: ${title}`
            userStoryField.value = userStory
            interfaceBehaviorField.value = interfaceBehavior
            commentsField.value = comments
            for (frontendTaskData of frontendTasksData) {
                addTaskInputsFields ('frontend', tasksData=frontendTaskData)
            }
            for (backendTaskData of backendTasksData) {
                addTaskInputsFields ('backend', tasksData=backendTaskData)
            }
        })
    }).catch((error) => {
        console.error(error)
        console.log('O arquivo README.md não existe no diretório')
    })
}

function getStringBetween (char1, char2, text) {
    return text.split(char1)[1].split(char2)[0]
}

function addImageInputsFields (imageFieldData=undefined) {
    let imageDescriptionValue = ''
    let imageSrcValue = ''
    if (imageFieldData) {
        imageDescriptionValue = `value="${getStringBetween('![', ']', imageFieldData)}"`
        imageSrcValue = `value="${getStringBetween('](', ')', imageFieldData)}"`
    }
    const imageFieldsContainer = document.querySelector('#image-fields-container')
    let imageFieldsContainerInnerHTML = imageFieldsContainer.innerHTML
    const i = document.querySelectorAll('[id*="image-alt"]').length
    imageFieldsContainerInnerHTML = imageFieldsContainerInnerHTML + `
           <div id="image-fields-container-${i + 1}">
            <input id="image-alt-${i + 1}" type="text" ${imageDescriptionValue} placeholder="Descrição da imagem">
            <input id="interface-model-image-src-${i + 1}" type="text" ${imageSrcValue} placeholder="src da imagem">
            <button onclick="deleteImageFieldsContainer(${i + 1})" type="button" class="delete-button">Excluir</button>
        </div>
    `
    imageFieldsContainer.innerHTML = imageFieldsContainerInnerHTML
    const imageDescriptionFields = document.querySelectorAll('[placeholder="Descrição da imagem"]')
    const imageScrFields = document.querySelectorAll('[placeholder="src da imagem"]')
    if (imageDescriptionFields.length >= 1) {
        for (let i = 0; i <  imageDescriptionFields.length; i++) {
            const imageDescriptionField = imageDescriptionFields[i]
            const imageSrcField = imageScrFields[i]
            imageDescriptionField.addEventListener('keyup', function () {
                imageDescriptionField.setAttribute('value', imageDescriptionField.value)
            })
            imageSrcField.addEventListener('keyup', function () {
                imageSrcField.setAttribute('value', imageSrcField.value)
            })
        }
    }
}

function deleteImageFieldsContainer (imageFieldContainerId) {
    document.querySelector(`#image-fields-container-${imageFieldContainerId}`).remove()
}

function createAssignmentOptions(assignment) {
    const devSelectedArray = [
        '-- Atribuição --',
        'cleogarcia',
        'diunkz',
        'gaspar51',
        'icarosun',
        'LGugs',
        'shl0mo'
    ]
    for (let i = 0; i < devSelectedArray.length; i++) {
        if (devSelectedArray[i] === assignment)
            devSelectedArray[i] = 'selected'
        else
            devSelectedArray[i] = ''
    }
    return `
        <option value="" ${devSelectedArray[0]}>-- Atribuição --</option>
        <option value="cleogarcia" ${devSelectedArray[1]}>cleogarcia</option>
        <option value="diunkz" ${devSelectedArray[2]}>diunkz</option>
        <option value="gaspar51" ${devSelectedArray[3]}>gaspar51</option>
        <option value="icarosun" ${devSelectedArray[4]}>icarosun</option>
        <option value="LGugs" ${devSelectedArray[5]}>LGugs</option>
        <option value="shl0mo" ${devSelectedArray[6]}>shl0mo</option>
    `
}

function addTaskInputsFields (taskType, tasksData={}) {
    if (taskType !== 'backend' && taskType !== 'frontend') {
        console.log('addTaskInputsFields(): Escolha um tipo de tarefa válido')
        return
    }
    let taskDescriptionValue = ''
    const tasksFieldsContainer = document.querySelector(`#${taskType}-tasks-fields-container`)
    let tasksFieldsContainerInnerHTML = tasksFieldsContainer.innerHTML
    const i = document.querySelectorAll('[id*="task-description-"]').length
    if (JSON.stringify(tasksData) !== "{}") {
        taskDescriptionValue = `value="${tasksData.taskDescription}`
    }
    tasksFieldsContainerInnerHTML = tasksFieldsContainerInnerHTML + `
        <div id="${taskType}-task-fields-container-${i + 1}">
            <input id="${taskType}-task-description-${i + 1}" type="text" class="width-60" ${taskDescriptionValue}"" placeholder="Descrição da tarefa">
            <select id="${taskType}-task-assignment-${i + 1}" placeholder="Atribuição" required>
            ${createAssignmentOptions(tasksData.taskAssignment)}
            </select>
            <button onclick="deleteTaskFieldsContainer(${i + 1}, '${taskType}')" type="button" class="delete-button">Excluir</button>
        </div>
    `
    tasksFieldsContainer.innerHTML = tasksFieldsContainerInnerHTML
    const taskDescriptionFields = document.querySelectorAll('[id*=-task-description-]')
    const taskAssignmentFields = document.querySelectorAll('[id*=-task-assignment-]')
    if (taskDescriptionFields.length >= 1) {
        for (let i = 0; i <  taskDescriptionFields.length; i++) {
            const taskDescriptionField = taskDescriptionFields[i]
            const taskAssignmentField = taskAssignmentFields[i]
            taskDescriptionField.addEventListener('keyup', function () {
                taskDescriptionField.setAttribute('value', taskDescriptionField.value)
            })
            taskAssignmentField.addEventListener('change', function () {
                const assignment = this.value
                this.innerHTML = createAssignmentOptions(assignment)
            })
        }
    }
}

function deleteTaskFieldsContainer (taskFieldContainerId, taskType) {
    document.querySelector(`#${taskType}-task-fields-container-${taskFieldContainerId}`).remove()
}

function populateTasksArray (tasksArray, tasksDescriptionsInputs, tasksAssignmentsSelects) {
    for (let i = 0; i < tasksDescriptionsInputs.length; i++) {
        const taskDescription = tasksDescriptionsInputs[i].value
        const taskAssignment = tasksAssignmentsSelects[i].value
        tasksArray.push({
            taskDescription: taskDescription,
            taskAssignment: taskAssignment
        })
    }
}

function makeREADME () {
    const title = document.querySelector('#title').value
    const userStory = document.querySelector('#user-story').value
    const imageFieldsDataArray = []
    const imageDescriptionInputs = document.querySelectorAll('[id*=image-alt-]')
    const imageImageSrcInputs = document.querySelectorAll('[id*=interface-model-image-src-]')
    for (let i = 0; i < imageDescriptionInputs.length; i++) {
        const imageDescription = imageDescriptionInputs[i].value
        const imageSrc = imageImageSrcInputs[i].value
        const voidImageDescription = imageDescription === ''
        const voidImageSrc = imageSrc === ''
        if (voidImageDescription | voidImageSrc) {
            alert('Preencha todos os campos')
            return
        }
        imageFieldsDataArray.push({
            imageDescription: imageDescription,
            imageSrc: imageSrc
        })
    }
    const interfaceBehavior = document.querySelector('#interface-behavior').value
    const comments = document.querySelector('#comments').value
    const frontendTasksArray = []
    const backendTasksArray = []
    const frontendTasksDescriptionInputs = document.querySelectorAll('[id*=frontend-task-description-]')
    const frontendTasksAssignmentSelects = document.querySelectorAll('[id*=frontend-task-assignment-]')
    const backendTasksDescriptionInputs = document.querySelectorAll('[id*=backend-task-description-]')
    const backendTasksAssignmentSelects = document.querySelectorAll('[id*=backend-task-assignment-]')
    populateTasksArray(frontendTasksArray, frontendTasksDescriptionInputs, frontendTasksAssignmentSelects)
    populateTasksArray(backendTasksArray, backendTasksDescriptionInputs, backendTasksAssignmentSelects)
    const voidTitle = title === ''
    const voidUserStoty = userStory === ''
    const voidImageFieldsDataArray = imageFieldsDataArray === ''
    const voidInterfaceBehavior = interfaceBehavior === ''
    const voidFrontendTasksArray = frontendTasksArray === ''
    const voidBackendTasksArray = backendTasksArray === ''
    if (voidTitle | voidUserStoty | voidImageFieldsDataArray | voidInterfaceBehavior | voidFrontendTasksArray | voidBackendTasksArray) {
        alert('Preencha todos os campos')
        return
    }
    const body = JSON.stringify({
        title: title,
        userStory: userStory,
        imageFieldsDataArray: imageFieldsDataArray,
        interfaceBehavior: interfaceBehavior,
        comments: comments,
        frontendTasksArray: frontendTasksArray,
        backendTasksArray: backendTasksArray
    })
    fetch('http://localhost:5000/makeREADME', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: body
    }).then((res) => {
        if (res.status == 200) {
            alert('README gerado com sucesso')
        } else {
            alert('Erro ao tentar gerar o README')
        }
    })
}
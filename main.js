class Project {
	constructor(projectName, todolist) {
		this.projectName = projectName;
		this.todolist = todolist;
	}
}

class ToDo {
	constructor(todoName, priority, checked) {
		this.todoName = todoName;
		this.priority = priority;
		this.checked = checked;
	}
}

class UI {
	static totalTodos() {
		const firstLine = document.querySelector('.first-line');

		const projects = Store.getProjects();
		let todosChecked = 0;
		const total = projects[currentTab].todolist.length;

		if(projects.length != 0) {
			firstLine.classList.add('item');
		}

		for(let i = 0; i < total; i++){
			if(projects[currentTab].todolist[i].checked == true){
				todosChecked += 1
			}
		}

		firstLine.innerHTML = `
			<span></span> <span>${todosChecked}/${total}</span>
		`;
	}

	static displayProjects() {
		const projects = Store.getProjects();

        projects.forEach((project) => UI.addProjectToList(project));
	}

	static displayTodos() {
		const projects = Store.getProjects();

		UI.totalTodos();
        projects[currentTab].todolist.forEach((todo) => UI.addTodoToList(todo));
	}
	
	static addProjectToList(project) {
		const list = document.querySelector('.project-list');
		const row = document.createElement('li');
		row.classList.add('row-data');
		row.classList.add('item');

		const projects = Store.getProjects();
		if(projects.length != 0) {
			if(project.projectName == projects[currentTab].projectName) {
			row.classList.add('current-tab');
			}
		}
		
		row.innerHTML = `
			${project.projectName} <span><i class="fas fa-trash delete"></i></span>
		`;

		list.appendChild(row);
		setData();
	}

	static addTodoToList(todo) {
		const list = document.querySelector('.todo-list');
		const row = document.createElement('li');
		row.classList.add('todo-data');
		row.classList.add('item');

		// Color for priorities
		if(todo.priority == 'low') {
			row.style.backgroundColor = 'rgba(71, 128, 43, 0.5)'; // Green
		} else if(todo.priority == 'medium') {
			row.style.backgroundColor = 'rgba(253, 172, 7, .5)'; // Yellow
		} else if(todo.priority == 'high') {
			row.style.backgroundColor = 'rgba(223, 0, 0, .5)'; // Red
		}

		if(todo.checked == true) {
			row.classList.add('checked');
		} else if(todo.checked == false) {
			row.classList.remove('checked');
		}

		row.innerHTML = `
			${todo.todoName} <span><i class="fas fa-trash delete"></i></span>
		`;

		list.appendChild(row);
		setData();
	}

	static checkTodo(todo) {
		const projects = Store.getProjects();
		const todoIndex = todo.getAttribute('data-attribute');

		if(projects[currentTab].todolist[todoIndex].checked == false) {
			projects[currentTab].todolist[todoIndex].checked = true;
			todo.classList.add('checked');
		} else if(projects[currentTab].todolist[todoIndex].checked == true) {
			projects[currentTab].todolist[todoIndex].checked = false;
			todo.classList.remove('checked');
		}

		localStorage.setItem('projects', JSON.stringify(projects));
	}

	// Clear the precedent todolist when I click another tab
	static clearTodos() {
		const list = document.querySelector('.todo-list');

		list.innerHTML = ``
	}

	static clearProjects() {
		const list = document.querySelector('.project-list');

		list.innerHTML = ``
	}

	static deleteProject(el) {
		if(el.classList.contains('delete')){
	        if(confirm('Are you sure?')) {
	            el.parentElement.parentElement.remove();
	            setData();
	            Store.removeProject(el.parentElement.parentElement)
	        }
    	}
    }

    static deleteTodo(el) {
		if(el.classList.contains('delete')){
	        if(confirm('Are you sure?')) {
	            el.parentElement.parentElement.remove();
	            setData();
	            Store.removeTodo(el.parentElement.parentElement)
	        }
    	}
    }

    static currentTab() {
		UI.clearTodos();
		UI.displayTodos();

		UI.clearProjects();
		UI.displayProjects();
    }

    static alert(message, position, moveHeader) {
    	const div = document.createElement('div');
        div.className = `alert`;
        div.appendChild(document.createTextNode(message));
        position.appendChild(div);

        if(moveHeader == true) {
        	// Vanish in 3 seconds
        	position.style.height = '30%';
        	setTimeout(() => position.style.height = '25%', 3000);
        	setTimeout(() => document.querySelector('.alert').remove(), 3000);
        } else {
        	setTimeout(() => document.querySelector('.alert').remove(), 3000);
        }
    }

	static clearFields() {
        document.querySelector('.project-input').value = '';
        document.querySelector('.todo-input').value = '';
    }
}

class Store {
	static getProjects() {
		let projects;

		if(localStorage.getItem('projects') === null) {
            projects = [];
        } else {
            projects = JSON.parse(localStorage.getItem('projects'));
        }

        return projects;
	}

	static addProject(project) {
		const projects = Store.getProjects();

        projects.push(project);

        localStorage.setItem('projects', JSON.stringify(projects));
	}

	static addTodo(todo) {
  		const projects = Store.getProjects();

  		projects[currentTab].todolist.push(todo);

  		localStorage.setItem('projects', JSON.stringify(projects));
	}

	static removeProject(row) {
		const projects = Store.getProjects();

        for(let i = 0; i < projects.length; i++) {
			if(i == row.getAttribute('data-attribute')) {
				projects.splice(i, 1);
			}
		}

        localStorage.setItem('projects', JSON.stringify(projects));
        setData();
	}

	static removeTodo(row) {
		const projects = Store.getProjects();

        for(let i = 0; i < projects[currentTab].todolist.length; i++) {
			if(i == row.getAttribute('data-attribute')) {
				projects[currentTab].todolist.splice(i, 1);
			}
		}

        localStorage.setItem('projects', JSON.stringify(projects));
        setData();
	}

	static doubleProject(projectName) {
		const projects = Store.getProjects();

		for(let i = 0; i < projects.length; i++) {
			if(projectName == projects[i].projectName) {
				return true;
			}
		}
	}
}

function setData() {
	let rowData = document.querySelectorAll('.row-data');
	let todoData = document.querySelectorAll('.todo-data');

	for(let i = 0; i < rowData.length; i++){
		rowData[i].setAttribute('data-attribute', i);
	}

	for(let i = 0; i < todoData.length; i++){
		todoData[i].setAttribute('data-attribute', i);
	}
}

let currentTab = 0;

// Event : Display Projects
document.addEventListener('DOMContentLoaded', UI.displayProjects);
// Event : Display Todos
document.addEventListener('DOMContentLoaded', UI.displayTodos);

// Event : Add a Project
document.querySelector('.project-btn').addEventListener('click', (e) => {
    // Get Form Value
    const projectName = document.querySelector('.project-input').value;
    // New todolist
    const todolist = [];

    // Validate
    if(projectName === '') {
    	const leftHeader = document.querySelector('.left-header');
    	UI.alert('Give a name to your project', leftHeader, true);
    } else if (Store.doubleProject(projectName) == true) {
    	const leftHeader = document.querySelector('.left-header');
    	UI.alert(`You already have a project named ${projectName}`, leftHeader, true);
    } else {
	    // Instatiate project
	    const project = new Project(projectName, todolist);

	    // Add Project to UI
	    UI.addProjectToList(project);

	    // Add project to store
	    Store.addProject(project);

	    // Display new project as new currentTab
	    const projects = Store.getProjects();
	    currentTab = projects.length -1;
	    UI.currentTab();

	    // Clear fields
	    UI.clearFields();
    }
});

// Event : Add a Todo
document.querySelector('.todo-btn').addEventListener('click', (e) => {
	// Get the list projects
	const projects = Store.getProjects();

    // Get Form Value
    const todoName = document.querySelector('.todo-input').value;
    // Get Priority
    let priority;
    if (document.getElementById('low-priority').checked) {
  		priority = document.getElementById('low-priority').value;
	} else if (document.getElementById('medium-priority').checked) {
		priority = document.getElementById('medium-priority').value;
	} else if (document.getElementById('high-priority').checked) {
		priority = document.getElementById('high-priority').value;
	}

    // Validate
    if(todoName === '') {
    	const rightHeader = document.querySelector('.right-header');
    	UI.alert('Give a name to your todo', rightHeader, true);
    } else if (projects.length == 0) {
    	const rightContent = document.querySelector('.right-content');
    	UI.alert('Create a project first', rightContent, false);
    } else {
	    // Instatiate todo
	    const todo = new ToDo(todoName, priority, false);

	    // Add todo to UI
	    UI.addTodoToList(todo);

	    // Add todo to store
	    Store.addTodo(todo);

	    // Clear fields
	    UI.clearFields();

	    // Keep track of total of todos
	    UI.totalTodos();
    }
});

// Event : Remove a Project
document.querySelector('.project-list').addEventListener('click', (e) => {
	// Remove project from UI
	UI.deleteProject(e.target);

	// Update currentTab UI if the deletedTab was the currentTab
	let deletedTab = e.target.parentElement.parentElement.getAttribute('data-attribute');
	if(deletedTab === currentTab) {
		currentTab -= 1;
		UI.currentTab();
	}
});

// Event : Remove a Todo
document.querySelector('.todo-list').addEventListener('click', (e) => {
	// Remove project from UI
	UI.deleteTodo(e.target);

    // Keep track of total of todos
    UI.totalTodos();
});

// Event : Selecting a Project
document.querySelector('.project-list').addEventListener('click', (e) => {
	if(e.target.classList.contains('row-data')) {
		currentTab = e.target.getAttribute('data-attribute');
		UI.currentTab();
	}
});

// Event : Checking a todo
document.querySelector('.todo-list').addEventListener('click', (e) => {
	if(e.target.classList.contains('todo-data')) {
		// Do the storing too
		UI.checkTodo(e.target);

		UI.totalTodos();
	}
});

UI.clearFields();
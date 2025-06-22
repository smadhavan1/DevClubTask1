const input = document.getElementById('task_input');
const add_button = document.querySelector('.btn-add');
const filter_dropdown = document.getElementById('filter_dropdown');
const list_container = document.getElementById('list_container');

let task_list = JSON.parse(localStorage.getItem('tasks')) || [];//To get the data in localStorage if present, otherwise create new

function save_tasks()
{
    localStorage.setItem('tasks', JSON.stringify(task_list));//To write to the localStorage
}

function show_all_tasks()//This function shows all the tasks in the order of pinned first, others next
{
    list_container.innerHTML = '';//To clear the screen first

    let tasks_to_show = [];//Creating an array for the tasks

    for (let i = 0; i < task_list.length; i++)
    {
        const task = task_list[i];

        if ((filter_dropdown.value === 'completed' && task.done) || (filter_dropdown.value === 'incomplete' && !task.done) || (filter_dropdown.value === 'all'))
        {
            tasks_to_show.push(task);//To filter based on the completed status
        }
    }

    tasks_to_show.sort(function (a, b)//Default sort function requires the following return values.
    {
        if (a.pinned && !b.pinned)
        {
            return -1;
        }
        else if (!a.pinned && b.pinned)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    });

    for (let i = 0; i < tasks_to_show.length; i++)
    {
        const task = tasks_to_show[i];

        const item = document.createElement('li');//Creating a list item
        item.className = 'task-item';

        const task_text = document.createElement('span');
        if (task.done)
        {
            task_text.className = 'task-text completed';
        }
        else
        {
            task_text.className = 'task-text';
        }
        task_text.textContent = task.text;

        const buttons = document.createElement('div');
        buttons.className = 'task-buttons';

        const done_button = document.createElement('button');
        if (task.done)
        {
            done_button.textContent = 'Not Done';//If task marked as done, we show the Not Done button
            done_button.style.backgroundColor = "red";
        }
        else
        {
            done_button.textContent = 'Done';//If task marked as not done, we show the Done button
        }
        done_button.className = 'btn-done';
        done_button.addEventListener('click', function ()//On clicking, we toggle the done button.
        {
            task.done = !task.done;
            save_tasks();
            show_all_tasks();
        });

        const pin_button = document.createElement('button');
        if (task.pinned)
        {
            pin_button.textContent = 'Unpin';//Show unpin button if already pinned.
        }
        else
        {
            pin_button.textContent = 'Pin';//Show pin button if not pinned.
        }
        pin_button.className = 'btn-pin';
        pin_button.addEventListener('click', function ()//On clicking, we toggle the pin button.
        {
            task.pinned = !task.pinned;
            save_tasks();
            show_all_tasks();
        });

        const delete_button = document.createElement('button');
        delete_button.textContent = 'Delete';
        delete_button.className = 'btn-delete';
        delete_button.addEventListener('click', function ()
        {
            const index = task_list.indexOf(task);
            if (index !== -1)
            {
                task_list.splice(index, 1);//To remove one element at the index
                save_tasks();
                show_all_tasks();
            }
        });

        const edit_button = document.createElement('button');
        edit_button.textContent = 'Edit';//Show edit button.
        edit_button.className = 'btn-edit';
        edit_button.addEventListener('click', function ()//On clicking edit, we allow user to change the task and show the save button
        {
            const new_input = document.createElement('input');
            new_input.value = task.text;
            new_input.className = 'task-edit-input';

            const save_button = document.createElement('button');
            save_button.textContent = 'Save';//Show save button.
            save_button.className = 'btn-save';
            save_button.addEventListener('click', function ()
            {
                const new_text = new_input.value.trim();
                if (new_text !== '')
                {
                    task.text = new_text;
                    save_tasks();
                    show_all_tasks();
                }
            });

            item.replaceChild(new_input, task_text);
            buttons.replaceChild(save_button, edit_button);
        });
        //Code to show buttons is below.
        buttons.appendChild(done_button);
        buttons.appendChild(pin_button);
        buttons.appendChild(delete_button);
        buttons.appendChild(edit_button);

        item.appendChild(task_text);
        item.appendChild(buttons);
        list_container.appendChild(item);
    }
}

add_button.addEventListener('click', function ()//For adding task.
{
    const text = input.value.trim();
    if (text !== '')
    {
        task_list.push(
        {
            text: text,
            done: false,
            pinned: false
        });
        save_tasks();
        show_all_tasks();
        input.value = '';
    }
});

filter_dropdown.addEventListener('change', show_all_tasks);

show_all_tasks();
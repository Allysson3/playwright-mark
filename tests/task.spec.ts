import { test, expect, APIRequestContext } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'

test('Deve poder cadastar uma nova tarefa', async ({ page, request }) => {

  const task: TaskModel = {
    name: 'Ler um livro de TypeScript',
    is_done: false
  }

  const TaskName = 'Ler um livro de TypeScript'

  await deleteTaskByHelper(request, task.name)

  await page.goto('http://localhost:8080')

  const inputTaskName = page.locator('input[class*=InputNewTask]')
  await inputTaskName.fill(task.name)

  await page.click('css=button >> text=Create')

  const target = page.locator(`css=.task-item p >> text=${task.name}`)
  await expect(target).toBeVisible()

})

test('Não deve permitir tarefa duplicada', async ({ page, request }) => {

  const task = {
    name: 'Comprar Ketchup',
    is_done: false
  }
  await deleteTaskByHelper(request, task.name)
  await postTask(request, task)

  await page.goto('http://localhost:8080')

  const inputTaskName = page.locator('input[class*=InputNewTask]')
  await inputTaskName.fill(task.name)

  await page.click('css=button >> text=Create')

  const target = page.locator('.swal2-html-container')
  await expect(target).toHaveText('Task already exists!')

})
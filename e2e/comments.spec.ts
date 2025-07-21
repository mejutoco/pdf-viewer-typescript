import { test, expect } from '@playwright/test'
import path from 'path';

const url = 'http://localhost:3000/'

test('Upload screen', async ({ page }) => {
  await page.goto(url)
  await expect(page).toHaveTitle(/A pdf viewer in typescript/)
});

test('Add and remove comments accross pages', async ({ page }) => {
  await page.goto(url)

  // upload file
  const fileChooserPromise = page.waitForEvent('filechooser')
  await page.getByText('file to upload').click()

  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(__dirname, 'test_file.pdf'));

  // check loaded pdf ui
  let currentPage = page.locator('.current-page')
  let totalPages = page.locator('.total-pages')
  let addButton = page.locator('button:text("Add")')
  let removeButton = page.locator('button:text("Remove")')
  let prevButton = page.locator('button:text("Prev")')
  let nextButton = page.locator('button:text("Next")')

  await expect(currentPage).toHaveText('1')
  await expect(totalPages).toHaveText('14')
  await expect(addButton).toBeVisible()
  await expect(removeButton).toBeVisible()
  await expect(prevButton).toBeVisible()
  await expect(prevButton).toHaveAttribute('disabled')
  await expect(nextButton).toBeVisible()
  await expect(page.locator('ul li')).toHaveText('No comments yet')

  // add a coment on page 1
  await addButton.click()
  
  // check status bar instructions
  let statusBar = page.locator('.status-bar p').first()
  await expect(statusBar).toHaveText('Click on the document to add a comment')

  // click to add
  await page.locator('.comment-area').click()
  // added to the comment list
  await expect(page.locator('ul li')).toHaveCount(1)
  
  // add a second one at different location
  await addButton.click()
  await expect(statusBar).toHaveText('Click on the document to add a comment')
  await page.mouse.click(300, 300);
  await expect(page.locator('ul li')).toHaveCount(2)
  // last one is selected
  await expect(page.locator('ul li').last()).toHaveClass('selected ')

  // go to next page successfully
  await nextButton.click()
  await expect(currentPage).toHaveText('2')

  // add a note on page 2
  await addButton.click()
  await page.mouse.click(300, 400);
  await expect(page.locator('ul li')).toHaveCount(3)

  // last one is selected
  await expect(page.locator('ul li').last()).toHaveClass('selected ')

  // select first comment from Tool panel
  await page.locator('ul li').first().click()
  await expect(page.locator('ul li').first()).toHaveClass('selected ')
  
  // and remove
  await removeButton.click()
  await expect(page.locator('ul li')).toHaveCount(2)

  // select second comment from Tool panel
  await page.locator('ul li').first().click()
  await expect(page.locator('ul li').first()).toHaveClass('selected ')
  
  // and remove
  await removeButton.click()
  await expect(page.locator('ul li')).toHaveCount(1)

  // select last standing comment from Tool panel
  await page.locator('ul li').first().click()
  await expect(page.locator('ul li').first()).toHaveClass('selected ')
  
  // and remove
  await removeButton.click()
  await expect(page.locator('ul li')).toHaveText('No comments yet')
});

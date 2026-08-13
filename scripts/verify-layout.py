import asyncio
import os
import json
import sys
from pathlib import Path
from playwright.async_api import async_playwright

SCREENSHOTS = Path("/tmp/browser/regression/screenshots")
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

async def check_centering(page, name):
    await page.wait_for_selector("main")
    # The sidebar pushes the main content. We check centering relative to the visible area next to the sidebar.
    container = await page.query_selector("main .max-w-4xl")
    if not container:
        container = await page.query_selector("main")
    
    if container:
        box = await container.bounding_box()
        main_el = await page.query_selector("main")
        main_box = await main_el.bounding_box()
        
        container_center_x = box['x'] + box['width'] / 2
        main_center_x = main_box['x'] + main_box['width'] / 2
        
        diff = abs(container_center_x - main_center_x)
        print(f"[{name}] Container width: {box['width']}, Main width: {main_box['width']}, Main X: {main_box['x']}")
        print(f"[{name}] Container Center X: {container_center_x}, Main Center X: {main_center_x}, Diff: {diff}")
        
        if diff > 2:
            print(f"FAIL: {name} is not centered. Diff: {diff}px")
            return False
        return True
    else:
        print(f"ERROR: Could not find main container on {name}")
        return False

async def main():
    success = True
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()

        # Check Home
        await page.goto("http://localhost:8080", wait_until="networkidle")
        if not await check_centering(page, "home"):
            success = False

        # Check Settings
        await page.goto("http://localhost:8080/settings", wait_until="networkidle")
        if not await check_centering(page, "settings"):
            success = False

        await browser.close()
    
    if not success:
        sys.exit(1)

if __name__ == '__main__':
    asyncio.run(main())

import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios'

interface ProductData {
    price: number; // Цена товара
    priceOld: number | null; // Старая цена товара
    rating: number | null; // Рейтинг товара
    reviewCount: number | null; // Количество отзывов
}

@Injectable()
export class ParserService {
    private readonly screenshotPath = path.join(__dirname, '..', '..', 'screenshot.jpg');
    private readonly productTextPath = path.join(__dirname, '..', '..', 'product.txt');

    async parseCategory(): Promise<void> {
        try {
            const apiUrl = `https://www.vprok.ru/catalog/7382/pomidory-i-ovoschnye-nabory`;

            fetch("https://www.vprok.ru/catalog/7382/pomidory-i-ovoschnye-nabory", {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,az;q=0.6",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "same-origin",
                    "upgrade-insecure-requests": "1",
                    "cookie": "access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5IiwianRpIjoidXVpZDc4MTJlZGQ5LTA2MGMtNDZhMy1hODY1LWE4OGU3ZTUwNDNiZmIzOTIyNmQxNTI1NmU2MDk0NmQyNTZhMWU1OThlMGFjOWFmODYzMTEiLCJpYXQiOjE3NDE0NjQ2MTMuODE4NTY3LCJuYmYiOjE3NDE0NjQ2MTMuODE4NTcsImV4cCI6MTc0MTU1MTAxMy44MTE4NDksInN1YiI6IiIsInNjb3BlcyI6W10sInNwbGl0X3NlZ21lbnQiOjAsIng1aWRfYWNjZXNzX3Rva2VuIjoiIiwiY3VzdG9tZXJfdXVpZCI6IiJ9.jcYW-77i87G2Imts5dZReBlfiW3xM__B12VJPmpSnKAB2R-l7la6eDaWgYX3HEawIZV8yIbvX4TzdelT52L4MXYKlu3dw7EhSkN437BLQG474OZXyDs3Be5Y9Vs91rWHcHI8FYLKDe1wpVVBeVU_67gvqF0waDXNYhtO2Px6MXvcOBb_XmrmWszSnfLDv_S1fbNOb3KM7LCq_fdX6QJ2pccA98Ng4EQ--c0Pt1Wwv7ZtUuUF_PiYb_KDDDj0jrhNIJgXSMXFTICOoOFVtgJ8AL9wjXzLczjuIXU6iXE7tzS96krLneC3PMhwWBxXrmcSXD1p2VRe90jgSffoHujrfFLKuhR0qrCSLBi2IEcERXLj0MXo7F4YCVfUDtG--8Bq9kzMMcAQbDqrEHRPB86GShF5jeF3wpGUTzaT8oObfSFmQPr1hGOEefStRlxnMYQDQDxEi3zJC_o02npcCzxLCvC2YV7C6QNUNGED3ZmMZFQAu1W6roAHAjGplCHBXdq0XoSK7KHTVf7G1zlnFCrrYh9zeBnP3xQ1HV3wSe1SuGFPTk-Wry_cOMlTV8fz-s5MNmWI8imVxxaDWMXLOQPzmfKz_vh70peblD5zXkQd7CRZcTnQZzljtQHgbiV3QmYwAvthCEmpDnRF-0FbX9DSWPzqiKQHuuDwuY6fYpAKuIo",
                    "Referer": "https://www.vprok.ru/catalog/7382/pomidory-i-ovoschnye-nabory",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": null,
                "method": "GET"
            })
                .then(response => console.log(response)) // или response.text() в зависимости от типа данных
                .then(data => console.log(data))
                .catch(error => console.error('Ошибка:', error));

            // const formattedProducts = products.map((product) => {
            //     return (
            //         `Название товара: ${product.name}\n` +
            //         `Ссылка на изображение: ${product.image}\n` +
            //         `Рейтинг: ${product.rating || 'Нет данных'}\n` +
            //         `Количество отзывов: ${product.reviewsCount || 0}\n` +
            //         `Цена: ${product.price} руб.\n` +
            //         `Акционная цена: ${product.promoPrice || 'Нет'}\n` +
            //         `Цена до акции: ${product.oldPrice || 'Нет'}\n` +
            //         `Размер скидки: ${product.discount || 'Нет'}\n\n`
            //     );
            // }).join('\n');

            // writeFileSync('products-api.txt', formattedProducts);
            // this.logger.log('Данные успешно сохранены в products-api.txt');
        } catch (error) {
            console.log('error', error);
            // this.logger.error('Ошибка при парсинге', error);
        }
    }


    // Функция для извлечения цены и преобразования в число
    private parsePrice(priceText: string | null): number {
        if (!priceText) return 0;
        const numericPrice = priceText.replace(/[^\d,\.]/g, '').replace(',', '.');
        return parseFloat(numericPrice);
    }

    // Запуск браузера
    private async launchBrowser(): Promise<Browser> {
        return puppeteer.launch({
            headless: false,
            slowMo: 100,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--start-maximized',
                '--window-size=1024x800'
            ],
        });
    }

    // Получение новой страницы с таймаутами
    private async getPage(browser: Browser): Promise<Page> {
        const page = await browser.newPage();
        await page.setDefaultTimeout(60000);
        await page.setDefaultNavigationTimeout(60000);
        await page.setViewport({ width: 1024, height: 800 });
        return page;
    }

    // Сохранение скриншота страницы
    private async captureScreenshot(page: Page): Promise<void> {
        await page.screenshot({ path: this.screenshotPath, fullPage: true });
    }

    // Задержка с использованием Promise и setTimeout
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Ожидание появления элемента
    private async waitForElement(page: Page, selector: string, timeout = 60000): Promise<void> {
        await page.waitForSelector(selector, { timeout });
    }

    // Клик по кнопке выбора региона в шапке сайта
    private async selectRegion(page: Page): Promise<void> {
        const regionButton = await page.$('[class^="Region_region__"]');
        if (regionButton) {
            await regionButton.click();
            console.log('Кнопка выбора региона нажата.');
        } else {
            console.log('Кнопка выбора региона не найдена.');
        }
    }

    // Проверка правильности текста в модальном окне выбор региона
    private async isRegionModalCorrect(page: Page): Promise<boolean> {
        const regionTitleSelector = '[class^="UiRegionListBase_title__"]';
        try {
            await this.waitForElement(page, regionTitleSelector);
            const regionTitle = await page.$eval(regionTitleSelector, el => el.textContent);
            // Преобразуем результат в булево значение
            return !!(regionTitle && regionTitle.includes('регион'));
        } catch {
            console.log('Модальное окно выбора региона не появилось или текст неверный.');
            return false;
        }
    }

    // Извлечение цен
    private async extractPrices(page: Page): Promise<[number, number]> {
        const [oldPrice, newPrice] = await page.evaluate(() => {
            const prices = Array.from(document.querySelectorAll('[class^="Price_price__"]'));
            const oldPriceText = prices.length > 2 ? prices[2]?.textContent : null;
            const newPriceText = prices.length > 3 ? prices[3]?.textContent : null;
            return [oldPriceText, newPriceText];
        });

        return [this.parsePrice(oldPrice), this.parsePrice(newPrice)];
    }

    // Извлечение рейтинга
    private async extractRating(page: Page): Promise<number | null> {
        const ratingValue = await page.evaluate(() => {
            const ratingSelector = document.querySelector('[class^="Summary_title__"]');
            if (ratingSelector && ratingSelector.textContent) {
                // Используем регулярное выражение, чтобы извлечь число
                const match = ratingSelector.textContent.match(/(\d+(\.\d+)?)/);
                return match ? parseFloat(match[0]) : null; // Преобразуем в число или возвращаем null, если не нашли
            }
            return null;  // Если элемент не найден или нет текста
        });

        return ratingValue;
    }

    // Извлечение отзывов
    private async extractReviewsCount(page: Page): Promise<number | null> {
        const reviewsCount = await page.evaluate(() => {
            // Ищем элемент с текстом "оценок" внутри div
            const reviewTextElement = Array.from(document.querySelectorAll('.Summary_title__lRoWU'))
                .find(el => el.textContent?.includes('оценок'));

            if (reviewTextElement) {
                // Находим родительский элемент
                const parentElement = reviewTextElement.closest('[class^="Summary_itemContainer__"]');
                if (parentElement) {
                    // Извлекаем количество отзывов (первое число перед "оценок")
                    const countText = reviewTextElement.textContent?.trim().split(' ')[0];
                    if (countText) {
                        return parseInt(countText, 10);  // Преобразуем в число
                    }
                }
            }

            return null;  // Если не удалось найти элемент или извлечь число
        });

        return reviewsCount;
    }

    // выбор региона
    private async getRegionByName(page: Page, targetRegion: string): Promise<ElementHandle | null> {
        const regionSelector = '[class^="UiRegionListBase_item___"]';

        // Получаем все элементы с нужным селектором
        const regionElements = await page.$$(regionSelector);

        // Ищем элемент, текст которого содержит targetRegion
        for (let el of regionElements) {
            const text = await el.evaluate((el) => el.textContent?.trim() || '');

            // Проверяем, если текст совпадает с targetRegion
            if (text.includes(targetRegion)) {
                return el;  // Возвращаем найденный элемент
            }
        }

        // Если нужный элемент не найден
        return null;
    }

    // Прокрутка страницы до нужного элемента
    private async scrollToElement(page: Page, selector: string): Promise<void> {
        await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, selector);
    }

    // Основной метод для парсинга страницы товара
    async parseProductPage(url: string, region: string): Promise<ProductData> {
        const browser = await this.launchBrowser();
        let page: Page;

        try {
            page = await this.getPage(browser);

            // Переход по URL и ожидание загрузки
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            await this.waitForElement(page, 'body');

            await page.waitForSelector('body', { visible: true });

            // Ожидание и клик по кнопке выбора региона
            await this.waitForElement(page, '[class^="Region_region__"]');
            await this.delay(5000);
            await this.captureScreenshot(page);
            await this.selectRegion(page);

            // Проверка модального окна выбора региона
            if (await this.isRegionModalCorrect(page)) {
                console.log('Модальное окно выбора региона отображается с правильным текстом.');

                const findRegion = await this.getRegionByName(page, region);

                if (findRegion) {
                    await findRegion.click();
                    console.log(`Найден выбранный регион: ${region}`);

                    // Ожидаем навигацию или изменение на странице после клика
                    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });  // ждем завершения загрузки после клика
                } else {
                    console.log('Регион не найден.');
                }
            }

            await this.scrollToElement(page, '[class^="ProductPage_buy__"]');
            await this.delay(5000);

            // Извлечение и вывод цен
            const [oldPrice, newPrice] = await this.extractPrices(page);
            console.log(`Старая цена: ${oldPrice}, Новая цена: ${newPrice}`);

            const rating = await this.extractRating(page);
            console.log('Рейтинг:', rating);

            const reviewCount = await this.extractReviewsCount(page);
            console.log('Количество отзывов:', reviewCount);

            const productData: ProductData = {
                price: newPrice,
                priceOld: oldPrice || null,
                rating,
                reviewCount
            };

            // Сохранение данных в файл
            await this.saveProductDataToFile(productData);

            return productData;
        } catch (error) {
            console.error(`Ошибка при парсинге страницы товара: ${error.message}`);
            throw new Error(`Ошибка при парсинге страницы товара: ${error.message}`);
        } finally {
            // await browser.close();
        }
    }

    // Сохранение данных о товаре в файл
    private async saveProductDataToFile(productData: ProductData): Promise<void> {
        const dataToSave = `
            price=${productData.price}
            priceOld=${productData.priceOld}
            rating=${productData.rating}
            reviewCount=${productData.reviewCount}
        `;

        const stream = fs.createWriteStream(this.productTextPath, { flags: 'w' });
        stream.write(dataToSave);
        stream.end();

        stream.on('error', (err) => {
            console.error('Ошибка при записи данных о товаре в файл:', err);
            throw new Error('Ошибка при записи данных о товаре в файл.');
        });

        return new Promise<void>((resolve) => {
            stream.on('finish', () => {
                console.log('Данные о товаре успешно сохранены в файл.');
                resolve();
            });
        });
    }
}

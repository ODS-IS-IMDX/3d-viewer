import React from 'react'
import { storiesOf } from '@storybook/react'

import { ItemsCarousel } from './ItemsCarousel'
import { CarouselItem } from './CarouselItem'
import { action } from '@storybook/addon-actions'

storiesOf('ItemsCarousel', module)
  .addParameters({
    component: ItemsCarousel,
    subcomponents: { CarouselItem }
  })
  .addDecorator(story => (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'grey' }}>
      {story()}
    </div>
  ))
  .add('Items carousel with 5 items', () => (
    <ItemsCarousel defaultSelected={0} onChange={action('onChange')}>
      <ItemsCarousel.Item visible>Jun 20, 2018, 09:00</ItemsCarousel.Item>
      <ItemsCarousel.Item visible={false}>
        Jul 20, 2018, 10:00
      </ItemsCarousel.Item>
      <ItemsCarousel.Item visible={false}>
        Aug 20, 2018, 11:00
      </ItemsCarousel.Item>
      <ItemsCarousel.Item visible={false}>
        Sep 20, 2018, 12:00
      </ItemsCarousel.Item>
      <ItemsCarousel.Item visible={false}>
        Oct 20, 2018, 13:00
      </ItemsCarousel.Item>
    </ItemsCarousel>
  ))

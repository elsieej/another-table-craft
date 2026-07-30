import type { ReactNode } from 'react'
import Heading from '@theme/Heading'
import styles from './styles.module.css'

type FeatureItem = {
  title: string
  description: ReactNode
}

const FeatureList: FeatureItem[] = [
  {
    title: 'Headless core',
    description: (
      <>
        <code>useTableCraft</code> owns the single <code>useReactTable()</code> call and exposes state + handlers, fully
        decoupled from any specific state-storage mechanism or presentation layer.
      </>
    )
  },
  {
    title: 'Query-param state by default',
    description: (
      <>
        A zero-dependency URL-backed store syncs pagination, sorting, and filters to the URL via the native History API,
        so table state survives a refresh or a shared link without any setup.
      </>
    )
  },
  {
    title: 'Config cascade',
    description: (
      <>
        A four-layer config system — defaults, provider, instance, plugins — lets you set sane global defaults once and
        override them per table instance.
      </>
    )
  }
]

function Feature({ title, description }: FeatureItem) {
  return (
    <div className='col col--4'>
      <div className='text--center padding-horiz--md'>
        <Heading as='h3'>{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className='container'>
        <div className='row'>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}

import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'
import { makeServer } from '@/miragejs/server'

const mountProductCard = () => {
  // Criando o produto com os parâmetros customizados
  const product = server.create('product', {
    title: 'Relógio bonito',
    price: '23.00',
    image:
      'https://images.unsplash.com/photo-1532667449560-72a95c8d381b?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
  })
  // Wrapper montando o elemento
  const wrapper = mount(ProductCard, {
    propsData: {
      product,
    },
  })
  return {
    wrapper,
    product,
  }
}
describe('ProductCard - Unit', () => {
  // Request no servidor
  let server
  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })
  // Fechando conexão com o servidor
  afterEach(() => {
    server.shutdown()
  })

  // Snapshot
  it('should match snapshot', () => {
    const { wrapper } = mountProductCard()
    expect(wrapper.element).toMatchSnapshot()
  })

  // Conteúdo do wrapper
  it('should mount the component', () => {
    const { wrapper } = mountProductCard()
    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain('Relógio bonito')
    expect(wrapper.text()).toContain('23.00')
  })
  // Ação de click no botão
  it('should emit the event addToCard with product object it selected ', async () => {
    const { wrapper, product } = mountProductCard()

    // Find neste caso porque só existe um butão no elemento
    await wrapper.find('button').trigger('click')

    // Verificando o retorno da função emit
    expect(wrapper.emitted().addToCart).toBeTruthy()

    // Quantidades de vezes que o evento foi chamado
    expect(wrapper.emitted().addToCart.length).toBe(1)

    // Verifica se retorno é igual ao array contendo o produto adicionado
    expect(wrapper.emitted().addToCart[0]).toEqual([{ product }])
  })
})

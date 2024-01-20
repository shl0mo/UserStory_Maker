# [US01]: Página Inicial

## História de Usuário
Como usuário, eu gostaria de ter uma interface amigável para visualizar os eventos em destaque, filtrar eventos por localização e poder ter a opção de visualizá-los por categoria. A interface também deve fornecer um meio para que eu me cadastre, realize a autenticação na plataforma e visualize o meu carrinho de compras, de modo que eu possa começar a ter acesso às funcionalidades que a plataforma me oferece.


## Modelo da Interface de Usuário
![initial page](./frontend/layouts/01-paginaInicial.png)



## Comportamento da Interface
- Ao preencher o input de busca de eventos e clicar no botão com o ícone da lupa, o usuário é redirecionado para uma página na qual são listados todos os eventos que correspondem à busca realizada
- Ao clicar em um de boxes de filtragem por eventos, o usuário deve ser redirecionado para uma página onde serão listados todos os eventos correspondentes à categoria exibida no box clicado
- Ao clicar no botão **CADASTRE-SE**, o modal de cadastro deve ser exibido
	- Ao clicar no botão **FECHAR** do modal, este deve deixar de ser exibido
	- Ao clicar no botão **CADASTRAR** do modal
		- Se os campos não tiverem sido preenchidos devidamente, a aplicação interrompe o processo de cadastro e notifica ao usuário que os campos devem ser preenchidos corretamente
		- Se os campos tiverem sido devidamente preenchidos, uma requisição é enviada para o servidor com os dados preenchidos pelo usuário
			- Se o cadastro for bem sucedido, o usuário deve ser notificado que foi cadastrado com sucesso
			- Se o cadastro falhar, o usuário deve ser notificado da falha
- Ao clicar no botão **ACESSE SUA CONTA**, o modal de login é exibido
	- Ao clicar no botão **FECHAR** do modal, este deve deixar de ser exibido
	- Ao clicar no botão **LOGIN** do modal
		- Se os campos não tiverem sido preenchidos devidamente, a aplicação interrompe o processo de login e notifica que ao usuário que os campos devem ser preenchdos corretamente
		- Se os campos tiverem sido devidamente preenchidos, uma requisiçã é enviada para o servidor com os dados preenchidos pelo usuário
			- Se o login for bem sucedido, a página inicial da aplicação é recarregada, carregando os devidos dados da sessão do usuário
			- Se o login falhar, o usuário é notificado o e-mail ou senha preenchidos estão incorretos
- Ao clicar no botão **LOCALIZAÇÃO** o modal de localização deve ser exibido, permitindo ao usuário escolher uma cidade específica para que os resultados sejam filtrados. Uma vez que a cidade é escolhida, os eventos filtrados pela localização são exibidos na página
- Ao clicar no botão **MEU CARRINHO**, um modal é exibido, no qual os produtos são listados com os seus nomes, preços e as quantidades de cada um selecionadas pelo usuário
	- Ao clicar no botão **FINALIZAR COMPRA**, o usuário é redirecionado para a página de pagamento

### Observações

Para a primeira versão da funcionalidade, o carrinho de compras estará na sessão do usuário, não sendo persistido no banco de dados.

## Tarefas

### Frontend
<table>
<thead>
	<tr>
		<th>
			ID
		</th>
		<th>
			Descrição
		</th>
		<th>
			Atribuição
		</th>
	</tr>
</thead>
<tbody id="frontend-tasks-tbody">
	<tr>
		<td>
			US01-FT01
		</td>
		<td>
			Implementar a interface dos boxes dos links para o filtro dos eventos por categoria
		</td>
		<td>
			<a href="https://github.com/gaspar51">gaspar51</a>
		</td>
	</tr>
	<tr>
		<td>
			US01-FT02
		</td>
		<td>
			Implementar a exibição os eventos diversos
		</td>
		<td>
			<a href="https://github.com/icarosun">icarosun</a>
		</td>
	</tr>
	<tr>
		<td>
			US01-FT03
		</td>
		<td>
			Implementar o modal de cadastro de usuário
		</td>
		<td>
			<a href="https://github.com/gaspar51">gaspar51</a>
		</td>
	</tr>
	<tr>
		<td>
			US01-FT04
		</td>
		<td>
			Implementar o modal de login de usuário
		</td>
		<td>
			<a href="https://github.com/gaspar51">gaspar51</a>
		</td>
	</tr>
	<tr>
		<td>
			US01-FT05
		</td>
		<td>
			Implementar o modal de localização
		</td>
		<td>
			<a href="https://github.com/icarosun">icarosun</a>
		</td>
	</tr>
	<tr>
		<td>
			US01-FT06
		</td>
		<td>
			Implementar o modal do carrinho
		</td>
		<td>
			<a href="https://github.com/gaspar51">gaspar51</a>
		</td>
	</tr>
</tbody>
</table>

### Backend
<table>
	<thead>
	<tr>
		<th>
			ID
		</th>
		<th>
			Descrição
		</th>
		<th>
			Atribuição
		</th>
	</tr>
</thead>
<tbody id="backend-tasks-tbody">
	<tr>
		<td>
			US01-BT01
		</td>
		<td>
			Implementar a filtragem de eventos do banco de dados por categoria
		</td>
		<td>
			<a href="https://github.com/LGugs">LGugs</a>
		</td>
	</tr>
	<tr>
		<td>
			US01-BT02
		</td>
		<td>
			Implementar a listagem de eventos diversos do banco de dados
		</td>
		<td>
			<a href="https://github.com/LGugs">LGugs</a>
		</td>
	</tr>
	<tr>
		<td>
			US01-BT03
		</td>
		<td>
			Implementar o cadastro de usuários no banco de dados
		</td>
		<td>
			<a href="https://github.com/shl0mo">shl0mo</a>
		</td>
	</tr>
	<tr>
		<td>
			US01-BT04
		</td>
		<td>
			Implementar a autenticação do usuário
		</td>
		<td>
			<a href="https://github.com/shl0mo">shl0mo</a>
		</td>
	</tr>
	<tr>
		<td>
			US01-BT05
		</td>
		<td>
			Implementar o endpoint de listagem das localidades
		</td>
		<td>
			<a href="https://github.com/icarosun">icarosun</a>
		</td>
	</tr>
</tbody>
</table>


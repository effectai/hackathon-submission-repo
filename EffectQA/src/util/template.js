// export const TEMPLATE_HTML =
//   `<div>
//     <image src='` +
//   "${image_url}" +
//   `'></image>
//     <h2>What do you see in the picture above? 🐸</h2>
//     <input type='radio' name='radio-answer' id="original" label=''>Stars 🤩</input><br>
//     <input type='radio' name='radio-answer' id="original" label=''>Mechanical Turk 😏</input><br>
//     <input type='radio' name='radio-answer' id="original" label=''>Dog 🤐</input> <br>
//     <input type='radio' name='radio-answer' id="original" label=''>Cat 😵</input><br>
//     <hr>
//     <button type="submit">Submit</button>
// </div>
// <script></script>
// <style></style>`;

export const TEMPLATE_HTML =
  `<div>
<h3>` +
  "${title}" +
  `</h3>
<p><a href=` +
  "'${url}'" +
  `target="_blank">` +
  "${url}" +
  `</a></p>
<p>` +
  "${description}" +
  `</p>
<br/>
<hr/>

<h4>Were you able to complete the task successfully?</h2>
<input type='radio' name='radio-answer' id="task-success" label=''>Yes</input><br>
<input type='radio' name='radio-answer' id="task-success" label=''>No</input><br>
<br/>
<h4>What feedback do you have on the experience?</h4>
<textarea name='explain' id="explain" label='Explanation' rows="6" cols="50"></textarea>
<h4>[Optional] Do you have a recording or screenshot?</h4>
<input type='text' size="50" name='image' id="image" label='Enter link'/>

<hr/>
<button type="submit">Submit</button> 
</div>
<script></script>
<style></style>`;
